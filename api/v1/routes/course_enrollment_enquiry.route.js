const CourseEnrollmentEnquiryController = require("../controllers/course_enrollment_enquiry.controller");
const {
  CourseEnrollmentEnquiryMiddleware,
  HomeMiddleware,
} = require("../middlewares");

const Router = require("express").Router();

Router.post(
  "/",
  //HomeMiddleware.isCorrect,
  CourseEnrollmentEnquiryMiddleware.validateCourseEnrollmentEnquiry,
  CourseEnrollmentEnquiryController.createCourseEnrollmentEnquiry
);

Router.put(
  "/",
  HomeMiddleware.isCorrect,
  CourseEnrollmentEnquiryController.updateCourseEnrollmentEnquiry
);

Router.get(
  "/:enquiry_selector?",
  CourseEnrollmentEnquiryController.getCourseEnrollmentEnquirys
);
Router.delete(
  "/:enquiry_selector?",
  HomeMiddleware.isCorrect,
  CourseEnrollmentEnquiryController.deleteCourseEnrollmentEnquiry
);

module.exports = Router;
