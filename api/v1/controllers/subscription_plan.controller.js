const { Types } = require("mongoose");
const AppConfig = require("../../../config/app.config");
const { CommonLib } = require("../../../lib");
const { SubscriptionPlanService } = require("../services");
const {
  BadRequestError,
  UnprocessableEntityError,
  NotFoundError,
} = require("../../../errors/http/http.errors");

const SubscriptionPlanController = {
  async createPlan(req, res, next) {
    try {
      const body = req.body;
      const formattedData = {};
      for (const key of AppConfig.subscription_model_keys) {
        if (body[key.post_key]) {
          formattedData[key.column_key] =
            key.post_key === "discount"
              ? Number(body[key.post_key])
              : body[key.post_key];
        }
      }
      const result = await SubscriptionPlanService.createSubscriptionPlan(
        formattedData
      );
      next(result);
    } catch (e) {
      next(e);
    }
  },

  async getPlans(req, res, next) {
    try {
      const { plan_selector } = req.params;
      const filter = {
        is_deleted: false,
        is_active: true,
      };
      if (req.user && req.user.user_type && req.user.user_type === "admin") {
        delete filter.is_active;
      }
      let response = {};
      if (plan_selector) {
        switch (CommonLib.isValidObjectId(plan_selector)) {
          case true:
            filter._id = new Types.ObjectId(plan_selector);
            break;
          case false:
            filter.slug = plan_selector;
          default:
            break;
        }
        response =
          (await SubscriptionPlanService.getOneSubsciptionPlan(filter)) || {};
      } else {
        const query = req.query;
        const page = query.page ? parseInt(query.page) : 1;
        const size = query.limit ? parseInt(query.limit) : 10;
        const index = page ? (page - 1) * size : 0;
        if (query.searchValue && query.searchField) {
          filter[query.searchField] = {
            $regex: query.searchValue,
            $options: "i",
          };
        }
        const { count, subscriptions } =
          await SubscriptionPlanService.getAllSubscriptionPlan({
            filter: filter,
            index,
            size,
          });
        response.pagination = CommonLib.getPagination(page, size, count);
        response.data = subscriptions;
      }
      next(response);
    } catch (e) {
      next(e);
    }
  },

  async deletePlan(req, res, next) {
    try {
      const { plan_selector } = req.params;
      const filter = {
        is_deleted: false,
        is_active: true,
      };
      if (plan_selector) {
        switch (CommonLib.isValidObjectId(plan_selector)) {
          case true:
            filter._id = new Types.ObjectId(plan_selector);
            break;
          case false:
            filter.slug = plan_selector;
          default:
            break;
        }
      } else {
        throw new UnprocessableEntityError(
          "Invalid Plan Selected. Contact Support"
        );
      }
      const isExist = await SubscriptionPlanService.getOneSubsciptionPlan(
        filter
      );
      if (!isExist) {
        throw new NotFoundError(
          "No plan found. Either It's already deleted or Invalid Plan selected"
        );
      }
      const result = await SubscriptionPlanService.updatePlan({
        filter: filter,
        updateOptions: { is_deleted: true, updatedAt: new Date() },
      });
      next(
        CommonLib.generateDeleteMessage(result, isExist?.plan_name || "Plan")
      );
    } catch (e) {
      next(e);
    }
  },

  async updatePlan(req, res, next) {
    try {
      const body = req.body;
      if (!body.plan_id || !CommonLib.isValidObjectId(body.plan_id)) {
        throw new UnprocessableEntityError("Invalid Plan Selected");
      }
      const filter = {
        _id: new Types.ObjectId(body.plan_id),
        is_deleted: false,
      };
      const isExist = await SubscriptionPlanService.getOneSubsciptionPlan(
        filter
      );
      if (!isExist) {
        throw new NotFoundError(
          "No plan found. Either It's already deleted or Invalid Plan selected"
        );
      }
      const updateOptions = {
        updatedAt: new Date(),
      };
      for (const key of AppConfig.subscription_model_keys) {
        if (body.hasOwnProperty(key.post_key) && key.can_update) {
          updateOptions[key.column_key] = body[key.post_key];
        }
      }

      const result = await SubscriptionPlanService.updatePlan({
        filter: filter,
        updateOptions: updateOptions,
      });
      next(
        CommonLib.generateUpdateMessage(result, isExist?.plan_name || "Plan")
      );
    } catch (e) {
      next(e);
    }
  },

  async userAssociatedWithPlan(req, res, next) {
    try {
      const filter = {
        is_deleted: false,
      };
      const searchObject = {};
      const query = req.query;
      const { plan_id } = req.params;
      if (!plan_id || !CommonLib.isValidObjectId(plan_id)) {
        throw new UnprocessableEntityError("Invalid Plan Selected");
      }
      if (query.user_associated_plan_id) {
        filter._id = new Types.ObjectId(query.user_associated_plan_id);
        const result = await SubscriptionPlanService.userAssociatedWithPlan({
          filter: filter,
          index: 0,
          limit: 10,
          searchFilter: {},
        });
        next(result?.plans[0] || {});
      } else {
        const page = query.page ? parseInt(query.page) : 1;
        const size = query.limit ? parseInt(query.limit) : 10;
        const index = page ? (page - 1) * size : 0;
        filter.subscription_plan_id = new Types.ObjectId(plan_id);
        if (query.email && query.email !== "") {
          searchObject["USER.email"] = {
            $regex: query.email,
            $options: "i",
          };
        }
        const result = await SubscriptionPlanService.userAssociatedWithPlan({
          filter: filter,
          index: index,
          limit: size,
          searchFilter: searchObject,
        });
        const data = {
          data: result.plans,
          pagination: CommonLib.getPagination(page, size, result.count),
        };
        next(data);
      }
    } catch (e) {
      next(e);
    }
  },

  async updateUserAssociatedPlan(req, res, next) {
    try {
      const { user_associated_plan_id } = req.body;
      const body = req.body;
      if (
        !user_associated_plan_id ||
        !CommonLib.isValidObjectId(user_associated_plan_id)
      ) {
        throw new UnprocessableEntityError("Invalid Plan Selected");
      }
      const result = await SubscriptionPlanService.updateUserAssociatedPlan({
        filter: { _id: new Types.ObjectId(user_associated_plan_id) },
        updateOptions: body,
      });
      next({ message: "Plan Updated Successfully" });
    } catch (e) {
      next(e);
    }
  },
};

module.exports = SubscriptionPlanController;
