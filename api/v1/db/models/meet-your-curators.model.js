const mongoose = require('mongoose');

const meetCuatorsSchema = new mongoose.Schema({
    image: {type: String, required: true},
    name: { type: String, required: true },
    desgination: { type: String, required: true },
    at: { type: String, required: true  },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update `updatedAt` field on every document save
meetCuatorsSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const meetcuatorsModel = mongoose.model('Meetcuators', meetCuatorsSchema);
module.exports = meetcuatorsModel;