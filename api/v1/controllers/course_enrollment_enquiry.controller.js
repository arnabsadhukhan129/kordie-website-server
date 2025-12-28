const { Types } = require("mongoose");
const AppConfig = require("../../../config/app.config");
const { CommonLib } = require("../../../lib");
const {
  CourseEnrollmentEnquiryService,
  NotificationService,
} = require("../services");
const { User } = require("../db/models");
const {
  UnprocessableEntityError,
  NotFoundError,
} = require("../../../errors/http/http.errors");

const CourseEnrollmentEnquiryController = {
  async createCourseEnrollmentEnquiry(req, res, next) {
    try {
      const body = req.body;
      const formattedData = {};
      for (const key of AppConfig.course_enrollment_for_teams_model_keys) {
        if (body[key.post_key]) {
          formattedData[key.column_key] = body[key.post_key];
        }
      }
      const result =
        await CourseEnrollmentEnquiryService.createCourseEnrollmentEnquiry(
          formattedData
        );
      const adminUser = await User.findOne({
        user_type: { $in: ["admin"] }, // Use $in to check if 'admin' exists in the array
      });

      if (adminUser.notify_email) {
        NotificationService.sendNotification(
          adminUser.notify_email,
          {
            full_name: req.body.full_name,
            linkedin: req.body.linkedin,
            email: req.body.email,
            company: req.body.company,
            message: req.body.message,
          },
          "corporate_admin_enquiry"
        )
          .then((r) => {
            console.log(r, "Corporate enquiry mail send");
          })
          .catch((e) => {
            console.log(e, "Corporate enquiry mail error");
          });
      }

      NotificationService.sendNotification(
        req.body.email,
        {
          full_name: req.body.full_name,
          linkedin: req.body.linkedin,
          email: req.body.email,
          company: req.body.company,
          message: req.body.message,
        },
        "corporate_enquiry"
      )
        .then((r) => {
          console.log(r, "Corporate enquiry mail send");
        })
        .catch((e) => {
          console.log(e, "Corporate enquiry mail error");
        });
      next(result);
    } catch (e) {
      next(e);
    }
  },

  async getCourseEnrollmentEnquirys(req, res, next) {
    try {
      const { enquiry_selector } = req.params;
      const filter = {
        is_deleted: false,
        is_active: true,
      };
      if (req.user && req.user.user_type && req.user.user_type === "admin") {
        delete filter.is_active;
      }
      let response = {};
      if (enquiry_selector) {
        if (!CommonLib.isValidObjectId(enquiry_selector)) {
          throw new UnprocessableEntityError("Invalid Enquiry selected");
        }
        filter._id = new Types.ObjectId(enquiry_selector);
        response =
          (await CourseEnrollmentEnquiryService.getOneCourseEnrollmentEnquiry(
            filter
          )) || {};
      } else {
        const query = req.query;
        const page = query.page ? parseInt(query.page) : 1;
        const size = query.size ? parseInt(query.size) : 10;
        const index = page ? (page - 1) * size : 0;
        const sortObject = { createdAt: -1 };
        const sortOrder = ["asc", "desc"];
        if (query.searchValue && query.searchField) {
          filter[query.searchField] = {
            $regex: query.searchValue,
            $options: "i",
          };
        }
        if (
          query.sortField &&
          query.sortValue &&
          sortOrder.includes(query.sortValue.toLowerCase())
        ) {
          sortObject[query.sortField] =
            query.sortValue.toLowerCase() === "asc" ? -1 : 1;
        }
        const { count, subscriptions } =
          await CourseEnrollmentEnquiryService.getAllCourseEnrollmentEnquiry({
            filter: filter,
            sort: sortObject,
            index,
            size,
          });
        response.data = subscriptions;
        response.pagination = CommonLib.getPagination(
          page,
          size,
          query.searchValue ? response.data.length : count
        );
      }
      next(response);
    } catch (e) {
      next(e);
    }
  },

  async deleteCourseEnrollmentEnquiry(req, res, next) {
    try {
      const { enquiry_selector } = req.params;
      const filter = {
        is_deleted: false,
        is_active: true,
      };
      if (enquiry_selector) {
        switch (CommonLib.isValidObjectId(enquiry_selector)) {
          case true:
            filter._id = new Types.ObjectId(enquiry_selector);
            break;
          case false:
            filter.slug = enquiry_selector;
          default:
            break;
        }
      } else {
        throw new UnprocessableEntityError(
          "Invalid CourseEnrollmentEnquiry Selected. Contact Support"
        );
      }
      const isExist =
        await CourseEnrollmentEnquiryService.getOneCourseEnrollmentEnquiry(
          filter
        );
      if (!isExist) {
        throw new NotFoundError(
          "No plan found. Either It's already deleted or Invalid CourseEnrollmentEnquiry selected"
        );
      }
      const result =
        await CourseEnrollmentEnquiryService.updateCourseEnrollmentEnquiry({
          filter: filter,
          updateOptions: { is_deleted: true, updatedAt: new Date() },
        });
      next(
        CommonLib.generateDeleteMessage(result, "Course Enrollment Enquiry")
      );
    } catch (e) {
      next(e);
    }
  },

  async updateCourseEnrollmentEnquiry(req, res, next) {
    try {
      const body = req.body;
      if (!body.enquiry_id || !CommonLib.isValidObjectId(body.enquiry_id)) {
        throw new UnprocessableEntityError(
          "Invalid CourseEnrollmentEnquiry Selected"
        );
      }
      const filter = {
        _id: new Types.ObjectId(body.enquiry_id),
        is_deleted: false,
      };
      const isExist =
        await CourseEnrollmentEnquiryService.getOneCourseEnrollmentEnquiry(
          filter
        );
      if (!isExist) {
        throw new NotFoundError(
          "No plan found. Either It's already deleted or Invalid CourseEnrollmentEnquiry selected"
        );
      }
      const updateOptions = {
        updatedAt: new Date(),
      };
      for (const key of AppConfig.course_enrollment_for_teams_model_keys) {
        if (body.hasOwnProperty(key.post_key) && key.can_update) {
          updateOptions[key.column_key] = body[key.post_key];
        }
      }

      
      const result =
        await CourseEnrollmentEnquiryService.updateCourseEnrollmentEnquiry({
          filter: filter,
          updateOptions: updateOptions,
        });
      next(
        CommonLib.generateUpdateMessage(result, "Course Enrollment Enquiry")
      );
    } catch (e) {
      next(e);
    }
  },
};

module.exports = CourseEnrollmentEnquiryController;
