const AppConfig = require("../../../config/app.config");
const {
  UnprocessableEntityError,
} = require("../../../errors/http/http.errors");

const CourseEnrollmentEnquiryMiddleware = {
  async validateCourseEnrollmentEnquiry(req, res, next) {
    try {
      const body = req.body;
      if (body) {
        for (const key of AppConfig.course_enrollment_for_teams_model_keys) {
          if (!body[key.post_key] && key.required) {
            throw new UnprocessableEntityError(
              `${key.message_name} is missing`
            );
          }
        }
      }
      next();
    } catch (e) {
      next(e);
    }
  },
};

module.exports = CourseEnrollmentEnquiryMiddleware;
