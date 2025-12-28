const mongoose = require('mongoose');

const StudentsSchema = new mongoose.Schema({
    image: {type: String, required: true},
    name: { type: String, required: true },
    desgination: { type: String, required: true },
    description: { type: String, required: true  },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update `updatedAt` field on every document save
StudentsSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const studentsModel = mongoose.model('Studentspeakforus', StudentsSchema);
module.exports = studentsModel;