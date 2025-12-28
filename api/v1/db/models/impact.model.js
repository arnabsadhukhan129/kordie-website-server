const mongoose = require('mongoose');
const impactSchema = new mongoose.Schema({
    impact_title: {
        type: String,
        required: true,
    },
    impact_video: {
        type: String,
    },
    impact_subtitle: {
        type: String,
    },
    impactsubsection:[{
        image: { type: String },
        title: { type: String },
    }],
    hospitality_title:{
        type: String,
    },
    hospitality_subtitle:{
        type: String,
    },
    hospitality_description:{
        type: String,
    },
    hospitality_image:{
        type: String,
    },
    hospitality_features: [
        {
        title: String,
        }
    ],
    hospitality_bottom_subtitle:{
        type: String,
    },
    employer_title: {
        type: String,
    },
    employer_description:{
        type: String,
    },
    employer_stats: [
      {
        image: {
            type: String,
        },
        stat: {
            type: String,
        },
        description: {
            type: String,
        },
      },
    ],
    employer_action: {
        type: String,
    },
    student_title: {
        type: String,
    },
    student_subtitle: {
        type: String,
    },
    student_description: {
        type: String,
    },
    student_image: {
        type: String,
    },
    student_action: {
        type: String,
    },
    sustainability_title:{
        type: String,
    },
    sustainability_description:{
        type: String,
    },
    sustainability_program:[{
        media: {
            type: String,
        },
        type: {
            type: String,
        },
        description: {
            type: String,
        },
    }],
    sustainability_text:{
        type: String,
    },
    sustainability_strategy_title:{
        type: String,
    },
    sustainability_strategy_description:{
        type: String,
    },
    sustainability_strategy_program:[{
        icon: {
            type: String,
        },
        image: {
            type: String,
        },
        description: {
            type: String,
        },
        title: {
            type: String,
        },
        action_url: {
            type: String,
        },
    }],

    sustainability_strategy_subtitle:{
        type: String,
    },
    sustainability_strategy_text:{
        type: String,
    },
    sustainability_image:{
        type: String,
    },

    goal_title:{
        type: String,
    },
    goal_icon:{
        type: String,
    },
    goal_image:{
        type: String,
    },
    goal_description:{
        type: String,
    },
    goal_social_title:{
        type: String,
    },
    goal_social:[{
        icon: {
            type: String,
        },
        title: {
            type: String,
        },
    }],
    goal_climate_title:{
        type: String,
    },
    goal_climate:[{
        icon: {
            type: String,
        },
        title: {
            type: String,
        },
    }],
    more_title:{
        type: String,
    },
    more_program:[{
        image: {
            type: String,
        },
        title: {
            type: String,
        },
        date: { type: Date, default: Date.now },
        action: { type: String }
    }],
    is_active: {
        type: Boolean,
        default: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('impact', impactSchema);