const mongoose = require('mongoose');

const blogBannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL to the image
    },
    linktitle: {
        type: String,
    },
    link: {
        type: String, // URL for the link
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('BlogBanner', blogBannerSchema);
