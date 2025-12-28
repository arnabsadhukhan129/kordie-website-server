const mongoose = require('mongoose');
// Define the schema for the main program (e.g., "Topic-focused programs")
const deliverSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,  // Store the image URL (could be from S3 or local path)
        required: false
    },
    link:{
       type: String,
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

// Create a model based on the schema
const Program = mongoose.model('atkodiewedeliver', deliverSchema);

module.exports = Program;
