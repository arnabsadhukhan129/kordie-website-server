const mongoose = require("mongoose");

const subscriptionPlanSchema = new mongoose.Schema(
  {
    plan_name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      default: 0, // Default value as a number
    },
    sub_title: {
      type: String,
      default: "",
    },
    details: [
      {
        type: String,
      },
    ],
    // validity_period: {
    //   type: Number,
    //   required: false,
    // },
    // validity_unit: {
    //   type: String,
    //   default: "months",
    // },
    tag: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    special_note: {
      type: String,
      default: "",
    },
    is_membership: {
      type: Boolean,
      default: false,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    course_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", 
      },
    ],
  },
  {
    timestamps: true,
  }
);

const subscriptionPlanModel = mongoose.model(
  "subscription_plan",
  subscriptionPlanSchema
);

module.exports = subscriptionPlanModel;
