const mongoose = require('mongoose');

// Define the Product schema
const productSchema = new mongoose.Schema({
  // Basic course details
  course_name: {
    type: String,
    required: true,
  },
  course_slug: {
    type: String,
    required: true,
  },
  course_description: {
    type: String,
  },
  course_intro: {
    type: String,
  },
  sana_course_id:{
    type: String,
    // required: true,
  },
  course_tag: [
    {
      tag: { 
        type: String, 
        // required: true 
      },
      color: { 
        type: String,
        // default: '#000000' 
      },
      text_color: {
        type: String,
        // enum: ['#323232', '#FFFFFF'], 
        // default: '#323232'
      }
    }
  ],

  // Relationships with other models
  course_topic: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
  }],
  course_time: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Time',
  },
  course_goal: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
  }],
  course_category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'coursecategory',
  }],
  course_teacher: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaughtBy',
  }],
  course_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Type',
  },
  course_interest: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interest',
  }],
  course_industry: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Industry',
  }],
  //Why take Course width kordie

  whytakecourse:[{
    title: {
              type: String,
              required: true,
          },
          // slug: {
          //     type: String,
          //     required: true,
          //     unique: true,
          // },
          image: {
              type: String, 
          },
          description: {
              type: String,
          },
  }],
  
  // Course media and pricing
  course_image: {
    type: String,
  },
  course_price: {
    type: Number,
  },
  last_updated_date:{
    type:String,
  },
  course_price_text: {
    type: String,
  },
  course_certificate: {
    type: String,
  },
  course_link_text: {
    type: String,
  },
  course_link_membership_text:{
    type: String,
  },

  // Learning details
  learn_title: {
    type: String,
  },
  learn_description: {
    type: String,
  },
  learn_subtitle: {
    type: String,
  },
  learn_outcomes: [{
    type: String,
  }],

  // Address details
  address_title: {
    type: String,
  },
  address_description: {
    type: String,
  },
  address_image: {
    type: String,
  },

  // Syllabus details
  syllabus_title: {
    type: String,
  },
  syllabus: [{
    image: { type: String },
    time:{ type: String },
    title: { type: String },
    description: { type: String },
    chapter1: { type: String },
    chapter2: { type: String },
    chapter3: { type: String },
    chapter4: { type: String },
    icon1:{ type: String },
    icon2:{ type: String },
    icon3:{ type: String },
    icon4:{ type: String },
  }],
  curator_title:{
    type: String,
  },
  kordie_title:{
    type: String,
  },
  plan_title:{
    type: String,
  },
  plan_subtitle:{
    type: String,
  },
  plan_description:{
    type: String,
  },
  plan_duration:{
    type: Number,
  },
  course_impact_title:{
    type: String,
  },
  course_impact_image:{
    type: String,
  },
  course_impact_summary:[{
    type: String,
  }],
  course_impact_testinomial_heading:{
    type: String,
  },
  course_impact_testinomial:[{
    date: { type: Date, default: Date.now },
    name: {type: String},
    designation: {type: String},
    feedback: {type: String}
  }],
  course_next_title:{
    type: String,
  },
  course_next_subtitle:{
    type: String,
  },
  course_next_id:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  faq_title:{
    type: String,
  },
  skill_track:{
    type: String,
  },

  course_date: { type: Date, default: Date.now },
 // Status flags
  is_feature: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  featured_at : {
    type: Date,
    default : Date.now
  }
}, { timestamps: true });

// Create the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
