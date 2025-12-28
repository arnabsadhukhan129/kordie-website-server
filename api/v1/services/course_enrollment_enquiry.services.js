const { CourseEnrollmentEnquiryModel } = require("../db/models");

const CourseEnrollmentEnquiryService = {
  async createCourseEnrollmentEnquiry(data) {
    const subscriptionData = (
      await CourseEnrollmentEnquiryModel.create(data)
    ).toJSON();
    return { message: "Enquiry created successfully", subscriptionData };
  },

  async getAllCourseEnrollmentEnquiry({
    index,
    size,
    sort = { createdAt: -1 },
    filter,
  }) {
    const query = CourseEnrollmentEnquiryModel.find(filter).sort(sort);
    if (index >= 0 && size) {
      query.skip(index).limit(size);
    }
    const subscriptions = await query.lean();
    const count = await CourseEnrollmentEnquiryModel.countDocuments({
      ...filter,
    });
    return { subscriptions, count };
  },

  async getOneCourseEnrollmentEnquiry(filter) {
    return await CourseEnrollmentEnquiryModel.findOne(filter).lean();
  },

  async updateCourseEnrollmentEnquiry({ filter, updateOptions }) {
    const result = await CourseEnrollmentEnquiryModel.updateOne(filter, {
      $set: updateOptions,
    });
    return result;
  },
};

module.exports = CourseEnrollmentEnquiryService;
