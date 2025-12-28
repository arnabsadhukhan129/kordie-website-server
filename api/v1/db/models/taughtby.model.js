const mongoose = require('mongoose');

const taughtBySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    image: {
        type: String,  // URL to the image (for example, the S3 URL or file path)
    },
    description: {
        type: String,
    },
    experience: {
        type: String,
    },
    benifit: {
        type: String,
    },
    skill: {
        type: String,
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

module.exports = mongoose.model('TaughtBy', taughtBySchema);
