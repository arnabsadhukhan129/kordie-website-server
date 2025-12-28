const mongoose = require('mongoose');

const viewedCourseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  viewedAt: { type: Date, default: Date.now },
},{ timestamps: true });

module.exports = mongoose.model('viewedcourse', viewedCourseSchema);
