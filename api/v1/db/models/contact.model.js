const { StringLib } = require('../../../../lib')
const mongoose = require('mongoose');
const { Schema } = mongoose;
const contactSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    jobtitle: {
        type: String,
    },
    country: {
        type: String,
    },
    company: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    type:{
        type: String,
    },
    message: { 
        type: String,
        // required: true
    },
    businessType: {
        type: String,
    },
    teamSize: {
        type: String,
    },
    requestServices: {
        type: [String],
    },
    attachCV: {
        type: String,
    },
    phone:{
        type:String,
    },
    countryCode:{
        type:String,
    },

    is_deleted: {
        type: Boolean,
        default: false
    }
},{ timestamps: true});

module.exports = mongoose.model('contact',contactSchema);