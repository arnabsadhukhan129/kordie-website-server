const mongoose = require('mongoose');

const HighlightsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    url: {
        type: String,
    },
    tag: {
        type: String,
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

const Highlights = mongoose.model('highlight', HighlightsSchema);
module.exports = Highlights;