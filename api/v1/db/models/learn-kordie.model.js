const mongoose = require('mongoose');

const learnKordieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    media: { type: String },
    type:{type: String, enum:['image','video'] },
    icon: { type: String },
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update `updatedAt` field on every document save
learnKordieSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const kordieModel = mongoose.model('Learnkordie', learnKordieSchema);
module.exports = kordieModel;