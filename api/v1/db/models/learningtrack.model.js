const mongoose = require('mongoose');

const learningTrackSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image:{
        type: String
    },
    link:{
        type: String
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

const LearningTrack = mongoose.model('learningtrack', learningTrackSchema);
module.exports = LearningTrack;
