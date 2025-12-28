const mongoose = require('mongoose')
const hospitalitySchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    media: { type: String },
    type:{type: String, enum:['image','video'] },
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

const HospitalityModel = mongoose.model('hospitalityschool', hospitalitySchema);
module.exports = HospitalityModel;
