const mongoose = require('mongoose');

const savedCourseSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('savedcourse', savedCourseSchema);
