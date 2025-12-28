const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
    },
    description: {
        type: String,
    },
    discount: {
        type: Number,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    subscription_date: {
        type: Date,
        default: Date.now
    },
    subscription_end_date: {
        type: Date, // Field for end date
    },
    is_free_plan: {
        type: Boolean,
        default: true
    },
    subscription_plan_id : {
        type : mongoose.Schema.Types.ObjectId
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
},{ timestamps: true });


const PlanModel = mongoose.model('plan', planSchema);
module.exports = PlanModel;
