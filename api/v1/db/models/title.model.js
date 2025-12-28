const mongoose = require('mongoose')
const titleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
    },
    description:
    {
        type: String
    },
    url:
    {
        type: String
    },
    image:{
        type: String,
    },
    video:{
        type: String,
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_show: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const TopicModel = mongoose.model('title', titleSchema);
module.exports = TopicModel;
