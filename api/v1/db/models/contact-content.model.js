const mongoose = require('mongoose');

const contactContentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
    },
    description: {
        type: String,
    },
    email: {
        type: String,
    },
    type: {
        type: String,
        enum: ['General Enquiry', 'Request a Demo', 'Learning Partner', 'Media & Press', 'Sales Inquiry', 'Candidate Inquiry'],
        required: true, // Ensure a value is always provided
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


const ContactContent = mongoose.model('contactcontent',  contactContentSchema);
module.exports = ContactContent;