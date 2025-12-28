const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'category', required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    video: { type: String },
    author: { type: String, required: true },
    timetoread:{ type: String },
    date: { type: Date, default: Date.now },
    meta: {
        title: { type: String },  // Meta title for SEO
        description: { type: String },  // Meta description for SEO
        keywords: [{ type: String }]  // SEO keywords
    },
    featured: { type: Boolean, default: false },
    course_category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coursecategory',
    }],
    course_type: {type: String,},
    blog_type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BlogType',
        required: false, // Make it optional
    }],
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    }
},{timestamps: true});

module.exports = mongoose.model('blog', blogSchema);
