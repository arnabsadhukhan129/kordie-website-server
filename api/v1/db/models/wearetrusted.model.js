const mongoose = require('mongoose');

const weAreTrustedSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    description: {
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

const WeAreTrusted = mongoose.model('wearetrusted', weAreTrustedSchema);
module.exports = WeAreTrusted;
