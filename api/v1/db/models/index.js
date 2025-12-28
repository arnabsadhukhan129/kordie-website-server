'use strict';
const monggose = require('mongoose');
const process = require('process');

const AdminConfig = require('./admin-config.model');
const User = require('./user.model');
const Role = require('./role.model');
const Session = require('./session.model');
const Otp = require('./otp.model');
const SignatureToken = require('./signature-token.model');
const Content = require('./admin-content.model');
const Plan = require('./plan.model');
const Learnkordie = require('./learn-kordie.model');
const Meetcuators = require('./meet-your-curators.model');
const Title = require('./title.model');
const Hospitality =  require('./hospitality-school.model');
const Delivery =  require('./at-kordie-we-deliver.model');
const TopicFocused = require('./topic-focused-programs.model');
const LearningTrack = require('./learningtrack.model');
const SupportGoals = require('./supportgoals.model');
const WeAreTrusted = require('./wearetrusted.model');
const Testimonial = require('./testimonial.model');
const Highlights = require('./highlights.model');
const ContactContent = require('./contact-content.model');
const Contact = require('./contact.model');
const Category = require('./category.model');
const Blog = require('./blog.model');
const CourseCategory = require('./course-category.model');
const CrucialSkillSet = require('./crucialskillset.model');
const Faqs = require('./faqs.model');
const ContactBanner = require('./contactbanner.model');
const Goal = require('./goal.model');
const Type = require('./type.model');
const Time = require('./time.model');
const Topic = require('./topic.model');
const TaughtBy = require('./taughtby.model');
const BlogBanner = require('./blogbanner.model');
const Product = require('./product.model');
const WhyTakeCourse = require('./whytakecourse.model');
const Industry = require('./industry.model');
const Interest = require('./interest.model');
const ViewedCourse = require('./viewedcourse.model');
const SavedCourse = require('./savedcourse.model');
const EnrolledCourse = require('./enrolledcourse.model');
const Impact = require('./impact.model');
const LearnWithKordie = require('./learnwithkordie.model');
const BlogType = require('./blogtype.model');
const About = require('./about.model');
const Whykordie = require('./whykordie.model');
const Payment =require('./payment.model');
const SubscriptionPlanModel = require('./subscription_plan.model');
const CourseEnrollmentEnquiryModel = require('./course_enrollment_enquiry.model');
const Business = require('./for-business.modal');
const ScentMarketing = require('./scent-marketing.model');
const CommentsLogModel = require('./comments-log.model');
const OnlineReputationManagement = require('./online-reputation-management.model');
const SustainabilityModel = require('./sustainability.model');

const mongooseConn = monggose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongooseConn.then(r => {
  console.log("MongoDB connected successfully");
}).catch(e => {
  console.log("DB Connection Error: ", e);
});

module.exports = {
  AdminConfig,
  User,
  Role,
  Session,
  Otp,
  SignatureToken,
  Content,
  Plan,
  Learnkordie,
  Meetcuators,
  Title,
  Hospitality,
  Delivery,
  TopicFocused,
  LearningTrack,
  SupportGoals,
  WeAreTrusted,
  Testimonial,
  Highlights,
  ContactContent,
  Contact,
  Category,
  Blog,
  CourseCategory,
  CrucialSkillSet,
  Faqs,
  ContactBanner,
  Goal,
  Type,
  Time,
  Topic,
  TaughtBy,
  BlogBanner,
  Product,
  WhyTakeCourse,
  Industry,
  Interest,
  ViewedCourse,
  SavedCourse,
  EnrolledCourse,
  Impact,
  LearnWithKordie,
  BlogType,
  About,
  Whykordie,
  Payment,
  SubscriptionPlanModel,
  CourseEnrollmentEnquiryModel,
  Business,
  ScentMarketing,
  CommentsLogModel,
  OnlineReputationManagement, 
  SustainabilityModel
};