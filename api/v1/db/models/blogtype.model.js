const mongoose = require('mongoose');
const blogtypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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

module.exports = mongoose.model('BlogType', blogtypeSchema);
