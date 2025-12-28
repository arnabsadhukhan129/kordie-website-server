const AppConfig = require("../../../config/app.config");
const {
  UnprocessableEntityError,
  UnauthorizedError,
  NotFoundError,
} = require("../../../errors/http/http.errors");
const { security, CommonLib, DateLib } = require("../../../lib");
const {
  CustomerService,
  NotificationService,
  ExcelService,
} = require("../services");
const { Types } = require("mongoose");
const brevoClient = require("../../../connectors/brevo.connector");
const moment = require("moment");

const CustomerController = {
  async createCustomer(req, res, next) {
    try {
      const body = req.body;
      const paymentArray = [];
      const PlanData = {};
      const baseCustomerData = {};
      for (const key of AppConfig.payment_keys) {
        baseCustomerData[key.column_key] = body[key.post_key];
      }

      if (body.courses && Array.isArray(body.courses)) {
        for (const index in body.courses) {
          const courseData = {
            ...baseCustomerData,
            course_id: body.courses[index].course_id || null,
            product_name: body.courses[index].course_name || "",
          };
          paymentArray.push(courseData);
        }
      }
      if (body.subcription_plan_id) {
        const subscriptionData = {
          ...baseCustomerData,
          subcription_plan_id: body.subcription_plan_id,
          product_name: body.product_name,
        };
        for (const key of AppConfig.plan_keys) {
          PlanData[key.column_key] = body[key.post_key];
        }
        PlanData.subscription_end_date = moment().add(1, "M");
        paymentArray.push(subscriptionData);
      }

      const Customer = await CustomerService.addPayment(paymentArray, PlanData);
      next({ message: "Customer added successfully", paymentArray });
    } catch (e) {
      next(e);
    }
  },

  async listCustomer(req, res, next) {
    try {
      const { customer_key } = req.params;
      const query = req.query;
      let Customer = {};
      if (customer_key && CommonLib.isValidObjectId(customer_key)) {
        Customer = await CustomerService.getOneCustomer({
          _id: new Types.ObjectId(customer_key),
          is_deleted: false,
        });
        next(Customer);
      } else {
        const page = query.page ? parseInt(query.page) : 1;
        const size = query.size ? parseInt(query.size) : 10;
        const index = page ? (page - 1) * size : 0;
        const sort = { createdAt: -1 };
        const searchObject = {};
        // if (query.searchField && query.searchVal) {
        //   searchObject[query.searchField] = {
        //     $regex: query.searchVal,
        //     $options: "i",
        //   };
        // }
        if (query.email && query.email !== "") {
          searchObject.email = {
            $regex: query.email,
            $options: "i",
          };
        }
        Customer.data = await CustomerService.listCustomer({
          filter: { is_deleted: false },
          sort: sort,
          searchObject,
        });

        Customer.pagination = CommonLib.getPagination(
          page,
          size,
          Customer.data.length
        );
        Customer.data = await CommonLib.paginateArray(
          Customer.data,
          page,
          size
        );
        next({ ...Customer });
      }
    } catch (e) {
      next(e);
    }
  },

  async updateCustomer(req, res, next) {
    try {
      const { _id, user_type } = req.user;
      const body = req.body;
      const customerUpdateOptions = {
        updated_at: Date.now(),
      };
      const { customer_id } = req.body;
      if (!customer_id) {
        throw new UnprocessableEntityError("Customer ID is required");
      }
      for (const key of AppConfig.customer_keys) {
        if (body[key.post_key])
          customerUpdateOptions[key.column_key] = body[key.post_key];
      }
      const update = await CustomerService.updateCustomer({
        filter: {
          _id: new Types.ObjectId(customer_id),
          is_deleted: false,
        },
        customerUpdateOptions: customerUpdateOptions,
      });
      next(CommonLib.generateUpdateMessage(update, "Customer"));
    } catch (e) {
      next(e);
    }
  },

  async deleteCustomer(req, res, next) {
    try {
      const { _id, user_type } = req.user;
      const { customer_id } = req.params;
      if (!customer_id)
        throw new UnprocessableEntityError("No Data Selected to Delete");
      const updatedOptions = {
        is_deleted: true,
        updated_at: Date.now(),
      };
      const deleteData = await CustomerService.updateCustomer({
        customerUpdateOptions: updatedOptions,
        filter: { _id: new Types.ObjectId(customer_id), is_deleted: false },
      });
      next(CommonLib.generateDeleteMessage(deleteData, "Customer"));
    } catch (e) {
      next(e);
    }
  },

  async blockCustomer(req, res, next) {
    try {
      const { _id, user_type } = req.user;
      const { customer_id } = req.params;
      if (!customer_id)
        throw new UnprocessableEntityError("No Data Selected to Delete");
      const customer = await CustomerService.getOneUser({
        _id: new Types.ObjectId(customer_id),
        is_deleted: false,
      });
      if (!customer) {
        throw new NotFoundError("Customer Not Found");
      }
      const updatedOptions = {
        is_active: !customer.is_active,
        updated_at: Date.now(),
      };
      const blockData = await CustomerService.updateCustomer({
        customerUpdateOptions: updatedOptions,
        filter: {
          _id: new Types.ObjectId(customer_id),
          is_deleted: false,
        },
      });
      next(
        `${customer.first_name} ${customer.last_name} ${
          customer.is_active ? "Blocked" : "Unblocked"
        } Successfully`
      );
    } catch (e) {
      next(e);
    }
  },

  async sendPrivateComment(req, res, next) {
    try {
      const { _id, user_type } = req.user;
      const { comment, subject, customer_id } = req.body;
      if (!customer_id || !CommonLib.isValidObjectId(customer_id))
        throw new UnprocessableEntityError(
          "No customer select to send message"
        );
      const customer = await CustomerService.getOneUser({
        _id: new Types.ObjectId(customer_id),
        is_deleted: false,
      });
      if (!customer) {
        throw new NotFoundError("Customer Not Found");
      }
      const emailPayload = {
        subject,
        comment,
        name: customer.first_name + " " + customer.last_name,
      };
      await NotificationService.sendNotification(
        customer.email,
        emailPayload,
        "private_comment_by_admin"
      );
      const commentLog = await CustomerService.createComment({
        ...req.body,
        admin_id: _id,
        user_id: customer_id,
      });
      next({ message: "Comment sent successfully" });
    } catch (e) {
      next(e);
    }
  },

  async listComments(req, res, next) {
    try {
      const { customer_id } = req.params;
      const query = req.query;
      let Comments = {};

      if (customer_id && CommonLib.isValidObjectId(customer_id)) {
        const page = query.page ? parseInt(query.page) : 1;
        const size = query.size ? parseInt(query.size) : 10;
        const index = page ? (page - 1) * size : 0;
        const sort = { createdAt: -1 };
        const searchObject = { user_id: new Types.ObjectId(customer_id) };

        if (query.search && query.search !== "") {
          searchObject.comment = {
            $regex: query.search,
            $options: "i",
          };
        }

        Comments.data = await CustomerService.listComments({
          filter: searchObject,
          sort: sort,
        });

        Comments.pagination = CommonLib.getPagination(
          page,
          size,
          Comments.data.length
        );
        Comments.data = await CommonLib.paginateArray(
          Comments.data,
          page,
          size
        );
        next({ ...Comments });
      } else {
        throw new UnprocessableEntityError("Customer ID is required");
      }
    } catch (e) {
      next(e);
    }
  },

  async newsletterCustomer(req, res, next) {
    try {
      try {
        const { Brevo, defaultClient } = brevoClient;
        const query = req.query;
        const listId = null;
        const customer = {};
        const offset = query.page ? parseInt(query.page) : 1;
        const limit = query.size ? parseInt(query.size) : 10;
        const apiInstance = new Brevo.ContactsApi();
        const response = await apiInstance.getContacts({
          limit: limit * 10,
          offset: 0,
        });
        const emailArray = response.contacts.map((contact) => contact.email);
        const filter = {
          email: { $in: emailArray },
          user_type: {
            $not: {
              $in: ["admin", "sub_admin"],
            },
          },
          is_deleted: false,
        };
        customer.data = await CustomerService.listCustomer({
          filter: filter,
          sort: { createdAt: -1 },
        });
        const columns = CommonLib.generateColumns(customer.data[0], []);
        customer.data = CommonLib.paginateArray(customer.data, offset, limit);
        const generateExcel = await ExcelService(
          columns,
          customer.data,
          "newsletter_customer"
        );
        if (generateExcel.error) {
          console.log("generateExcel.error--->", generateExcel.error);
          throw new UnprocessableEntityError(generateExcel.error);
        } else {
          const arrayBufferData = generateExcel.data;
          const buffer = Buffer.from(arrayBufferData);
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          res.setHeader(
            "Content-Disposition",
            'attachment; filename="newsletter_customer.xlsx"'
          );
          res.send(buffer);
        }
      } catch (e) {
        next(e);
      }
    } catch (e) {
      next(e);
    }
  },

  async nonCustomerList(req, res, next) {
    try {
      const filter = {
        user_type: {
          $not: {
            $in: ["admin", "sub_admin", "product_manager"],
          },
        },
        is_deleted: false,
        is_active: true,
      };
      const customer = await CustomerService.nonCustomerData({
        filter: filter,
      });
      next(customer);
    } catch (e) {
      next(e);
    }
  },
};

module.exports = CustomerController;
