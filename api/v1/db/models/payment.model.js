const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    session_id: {
        type: String,
    },
    status: {
        type: String,
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },
    product_name: {
        type: String,
    },
    price: {
        type: Number,
    },
    discount_amount:{
        type: Number,
        default:0
    },
    paid_amount:{
        type: Number,
    },
    purchase_date: {
        type: Date,
        default: Date.now
    },
    subcription_plan_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subscription_plan',
        default: null
    },
    course_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null
    },
    payment_method_type: {
        type: String,
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });


const PaymentModel = mongoose.model('payment', paymentSchema);
module.exports = PaymentModel;
