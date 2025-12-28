const mongoose = require('mongoose');

const whyKordieSchema = new mongoose.Schema(
    {
        why_title: { type: String, required: true },
        why_description: { type: String },
        why_banner: [
            {
                media: { type: String },
                type: { type: String, enum: ['video', 'image'] },
            },
        ],
        learning_title: { type: String },
        learning_description: [
            {
                title: { type: String},
            },
        ],
        learning_section: [
            {
                image: { type: String },
                title: { type: String },
                description: { type: String },
            },
        ],
        kordie_title: { type: String },
        kordie_section: [
            {
                description: { type: String },
            },
        ],
        kordie_image: { type: String },
        kordie_stand_title: { type: String },
        kordie_stand_section: [
            {
                title: { type: String },
                description: { type: String },
                image: { type: String },
            },
        ],
        next_title: { type: String },
        next_section: [
            {
                icon: { type: String },
                image: { type: String },
                title: { type: String },
                description: { type: String },
            },
        ],
        blog_title: { type: String },
        is_active: { type: Boolean, default: true},
        is_deleted: { type: Boolean, default: false},
    },
    { timestamps: true }
);


// Validation middleware for array length
whyKordieSchema.pre('validate', function (next) {
    if (this.why_banner && this.why_banner.length > 3) {
        return next(new Error('why_banner cannot have more than 3 items.'));
    }
    if (this.learning_description && this.learning_description.length > 2) {
        return next(new Error('learning_description cannot have more than 2 items.'));
    }
    if (this.learning_section && this.learning_section.length > 4) {
        return next(new Error('learning_section cannot have more than 4 items.'));
    }
    if (this.kordie_section && this.kordie_section.length > 2) {
        return next(new Error('kordie_section cannot have more than 2 items.'));
    }
    if (this.next_section && this.next_section.length > 2) {
        return next(new Error('next_section cannot have more than 2 items.'));
    }
    next();
});


whyKordieSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    if (update.why_banner && update.why_banner.length > 3) {
        return next(new Error('why_banner cannot have more than 3 items.'));
    }
    if (update.learning_description && update.learning_description.length > 2) {
        return next(new Error('learning_description cannot have more than 2 items.'));
    }
    if (update.learning_section && update.learning_section.length > 4) {
        return next(new Error('learning_section cannot have more than 4 items.'));
    }
    if (update.kordie_section && update.kordie_section.length > 2) {
        return next(new Error('kordie_section cannot have more than 2 items.'));
    }
    if (update.next_section && update.next_section.length > 2) {
        return next(new Error('next_section cannot have more than 2 items.'));
    }

    next();
});


// Middleware to enforce only one record in the collection
whyKordieSchema.pre('save', async function (next) {
    if (this.isNew) { 
    const existingRecord = await mongoose.model('WhyKordie').findOne();
    if (existingRecord) {
        return next(new Error('A record already exists. Please delete the existing record before adding a new one.'));
    }
    }
    next();
});

module.exports = mongoose.model('WhyKordie', whyKordieSchema);
