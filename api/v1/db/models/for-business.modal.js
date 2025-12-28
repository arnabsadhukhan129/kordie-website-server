const mongoose = require('mongoose');
const businessSchema = new mongoose.Schema({
    new_world_title: {
        type: String,
        required: true,
    },
    new_world_description: {
        type: String,
        required: true,
    },
    new_world_banner:[{
        image: {type: String},
        
    }],

    new_world_banner_bottom_section:[{
        title: { type: String },
        description: { type: String }
    }],


    kordie_supports_title: {
        type: String,
        required: true,
    },
    kordie_supports_subtitle: {
        type: String,
        required: true,
    },
    kordie_supports_description: {
        type: String,
        required: true,
    },
    kordie_supports_media:{
        type: String,
    },
    kordie_supports_type: {
        type: String,
        enum: ['video', 'image'], 
    },

    industry_title: {
        type: String,
        required: true,
    },

    industry_tab:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Industry',
          }],


    our_service:{
        title: { type: String },
        description: { type: String },
    },

    our_service_section:[{
        title: { type: String },
        description: { type: String },
        image: { type: String},
    }],

    // our_service_media:{
    //   type: String,
    // },

    our_service_section_next:[{
        title: { type: String },
        description: { type: String },
        media: { type: String },
        type: { type: String, enum: ['video', 'image'], },
    }],



    explore_title: {
        type: String,
        required: true,
    },

    explore_section:[{
        title: { type: String },
        description: { type: String },
        media: { type: String },
        type: { type: String, enum: ['video', 'image'], },
    }],


    area_title: {
        type: String,
        required: true,
    },
    area_description: {
        type: String,
        required: true,
    },

    area_section:[{
        title: { type: String },
        description: { type: String },
    }],


    discover_subtitle: {
        type: String,
        required: true,
    },
    discover_title:{
        type: String,
        required: true,
    },
    discover_description:{
        type: String,
        required: true,
    },
    discover_image:{
        type: String,
        required: true,
    },

    how_it_works_title: {
        type: String,
        required: true,
    },
    how_it_works_description: {
        type: String,
        required: true,
    },
    how_it_works_subtitle: {
        type: String,
        required: true,
    },
    how_it_works_section:[{
        title: { type: String },
        description: { type: String },
    }],



    how_it_different_title: {
        type: String,
        required: true,
    },

    how_it_different_section:[{
        logo: { type: String },
        title: { type: String },
        description: { type: String },
        media: { type: String },
        type: { type: String, enum: ['video', 'image'], },
    }],


    protecting_title: {
        type: String,
        required: true,
    },
    protecting_description: {
        type: String,
        required: true,
    },
    protecting_section:[{
        title: { type: String },
        description: { type: String },
        media: { type: String },
        type: { type: String, enum: ['video', 'image'], },
    }],

    ready_title: {
        type: String,
        required: true,
    },
    ready_description: {
        type: String,
        required: true,
    },


    insight_title: {
        type: String,
        required: true,
    }
    



}, { timestamps: true }
);


businessSchema.pre('validate', function (next) {
    if (this.new_world_banner && this.new_world_banner.length > 3) {
        return next(new Error('new_world_banner cannot have more than 3 items.'));
    }
    if (this.new_world_banner_bottom_section && this.new_world_banner_bottom_section.length > 4) {
        return next(new Error('new_world_banner_bottom_section cannot have more than 4 items.'));
    }
    if (this.our_service_section_next && this.our_service_section_next.length > 3) {
        return next(new Error('our_service_section_next cannot have more than 3 items.'));
    }
    if (this.area_section && this.area_section > 9) {
        return next(new Error('area_section cannot have more than 9 items.'));
    }
    if (this.how_it_works_section && this.how_it_works_section.length > 8) {
        return next(new Error('how_it_works_section cannot have more than 8 items.'));
    }
    if (this.how_it_different_section && this.how_it_different_section.length > 3) {
        return next(new Error('how_it_different_section cannot have more than 3 items.'));
    }
    if (this.protecting_section && this.protecting_section.length > 3) {
        return next(new Error('protecting_section cannot have more than 3 items.'));
    }
    next();
});



businessSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    if (update.new_world_banner && update.new_world_banner.length > 3) {
        return next(new Error('new_world_banner cannot have more than 3 items.'));
    }
    if (update.new_world_banner_bottom_section && update.new_world_banner_bottom_section.length > 4) {
        return next(new Error('new_world_banner_bottom_section cannot have more than 4 items.'));
    }
    if (update.our_service_section_next && update.our_service_section_next.length > 3) {
        return next(new Error('our_service_section_next cannot have more than 3 items.'));
    }
    if (update.area_section && update.area_section > 9) {
        return next(new Error('area_section cannot have more than 9 items.'));
    }
    if (update.how_it_works_section && update.how_it_works_section.length > 8) {
        return next(new Error('how_it_works_section cannot have more than 8 items.'));
    }
    if (update.how_it_different_section && update.how_it_different_section.length > 3) {
        return next(new Error('how_it_different_section cannot have more than 3 items.'));
    }
    if (update.protecting_section && update.protecting_section.length > 3) {
        return next(new Error('protecting_section cannot have more than 3 items.'));
    }
    next();
});

// Middleware to enforce only one record in the collection
businessSchema.pre('save', async function (next) {
    if (this.isNew) { 
    const existingRecord = await mongoose.model('business').findOne();
    if (existingRecord) {
        return next(new Error('A record already exists. Please delete the existing record before adding a new one.'));
    }
    }
    next();
});
module.exports = mongoose.model('business', businessSchema);