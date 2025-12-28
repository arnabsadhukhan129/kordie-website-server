const RegisterMiddleware = require("./auth/register.middleware");
const ResetPasswordMiddleware = require("./auth/reset-password.middleware");
const ChangePasswordMiddleware = require("./auth/change-password.middleware");
const SecurityMiddleware = require("./security/security.middleware");
const HomeMiddleware = require("./home/home.middleware");
const SubscriptionPlanMiddleware = require("./subscription_plan.middleware");
const CourseEnrollmentEnquiryMiddleware = require("./course_enrollment_enquiry.middleware");
const ProductMiddleware = require("./product.middleware");

module.exports = {
  RegisterMiddleware,
  ResetPasswordMiddleware,
  ChangePasswordMiddleware,
  SecurityMiddleware: SecurityMiddleware,
  HomeMiddleware,
  SubscriptionPlanMiddleware,
  CourseEnrollmentEnquiryMiddleware,
  ProductMiddleware
};
