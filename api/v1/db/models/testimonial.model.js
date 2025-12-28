const mongoose = require('mongoose');

const testimonialSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
    },
    image: {
        type: String,
    },
    feedback: {
        type: String,
        required: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Testimonial = mongoose.model('testimonial', testimonialSchema);
module.exports = Testimonial;
