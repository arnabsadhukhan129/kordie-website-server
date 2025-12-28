const SubscriptionPlanController = require("../controllers/subscription_plan.controller");
const {
  SubscriptionPlanMiddleware,
  HomeMiddleware,
} = require("../middlewares");

const Router = require("express").Router();

Router.post(
  "/",
  HomeMiddleware.isCorrect,
  SubscriptionPlanMiddleware.validateSubscriptionPlan,
  SubscriptionPlanController.createPlan
);

Router.put(
  "/",
  HomeMiddleware.isCorrect,
  SubscriptionPlanController.updatePlan
);

Router.get("/public/:plan_selector?", SubscriptionPlanController.getPlans);
Router.get("/get/:plan_selector?", SubscriptionPlanController.getPlans);
Router.get("/user/:plan_id?", SubscriptionPlanController.userAssociatedWithPlan);
Router.put("/user/", SubscriptionPlanController.updateUserAssociatedPlan);
Router.delete(
  "/:plan_selector?",
  HomeMiddleware.isCorrect,
  SubscriptionPlanController.deletePlan
);

module.exports = Router;
