const AppConfig = require("../../../config/app.config");
const {
  UnprocessableEntityError,
  ConflictError,
} = require("../../../errors/http/http.errors");
const { CommonLib } = require("../../../lib");
const { SubscriptionPlanService } = require("../services");

const SubscriptionPlanMiddleware = {
  async validateSubscriptionPlan(req, res, next) {
    try {
      const body = req.body;
      if (body) {
        for (const key of AppConfig.subscription_model_keys) {
          if (!body[key.post_key] && key.required) {
            throw new UnprocessableEntityError(
              `${key.message_name} is missing`
            );
          }
        }
      }
      const subscriptionPlan =
        await SubscriptionPlanService.getOneSubsciptionPlan({
          plan_name: body.plan_name,
        });
      if (subscriptionPlan && subscriptionPlan.length > 0) {
        throw new ConflictError("Subscription plan with same name already exists");
      }
      req.body.slug = CommonLib.generateSlugfromName(body.plan_name);
      next();
    } catch (e) {
      next(e);
    }
  },
};

module.exports = SubscriptionPlanMiddleware;
