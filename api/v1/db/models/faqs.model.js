const mongoose = require('mongoose');

const FaqsSchema = mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    faq_type: [{
        type: String,  
        required: true,
    }],
    is_deleted: {
        type: Boolean,
        default: false,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Faqs = mongoose.model('faq', FaqsSchema);
module.exports = Faqs;
