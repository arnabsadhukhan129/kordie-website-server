const mongoose = require('mongoose');

const enrolledCourseSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        courseId: { type: mongoose.Schema.Types.ObjectId, required: true },
        subscription_date: {
            type: Date,
            default: Date.now
        },
        subscription_end_date: {
            type: Date, // Field for end date
        },
        is_active: {
            type: Boolean,
            default: true
        },
        is_deleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('enrolledcourse', enrolledCourseSchema);
