const mongoose = require('mongoose');


const SectionSchema = new mongoose.Schema({
    title: { type: String},
    content: { type: String }, // Stores text, URLs, etc.
   });

const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, unique: true, required: true },  // URL structure for SEO
    body: { type: String },  // Text content
    images: [{ type: String }],  
    videos: [{ type: String }], 
    meta: {
        title: { type: String },  // Meta title for SEO
        description: { type: String },  // Meta description for SEO
        keywords: [{ type: String }]  // SEO keywords
    },
    sections: [SectionSchema],
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    }
},{timestamps: true});


const contentModel = mongoose.model('Content', contentSchema);
module.exports = contentModel;