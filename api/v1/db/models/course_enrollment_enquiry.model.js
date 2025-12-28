const mongoose = require("mongoose");

const CourseEnrollmentEnquirySchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    linkedin: {
      type: String,
      // required: true,
    },
    company: {
      type: String,
      required: true,
    },
    messageDetails: {
      type: String,
      required: false,
    },
    totalAmount:{
      type: Number,
      required: false,
    },
    discount:{
      type: Number,
      required: false,
    },
    paidAmount:{
      type: Number,
      required: false,
    },
    amountToBePaid:{
      type: Number,
      required: false,
    },
    paymentStatus: {
      type: String,
      required: false,
      enum: ['pending', 'paid', 'partially_paid', 'failed'], // Define allowed values
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const CourseEnrollmentEnquiryModel = mongoose.model(
  "course_enrollment_enquiry",
  CourseEnrollmentEnquirySchema
);

module.exports = CourseEnrollmentEnquiryModel;
