const mongoose = require('mongoose');
const aboutSchema = new mongoose.Schema({
    about_title: {
        type: String,
        required: true,
    },
    about_description: {
        type: String,
    },
    about_banner:[{
        image: {type: String},
    }],


    see_title: {
        type: String,
    },
    see_description: {
        type: String,
    },
    see_media: {
        type: String,
    },
    see_type: {
        type: String,
        enum: ['video', 'image'], 
    },
    

    economic_title:{
        type: String,
    },
    economic_section:[{
        title: { type: String }
    }],
    economic_icon:{
        type: String,
    },
    economic_description:{
        type: String,
    },
    economic_image:{
        type: String,
    },


    world_icon:{
        type: String,
    },
    world_title:{
        type: String,
    },
    world_section:[{
        title: { type: String },
        description: { type: String }
    }],
    world_subsection:[{
        title: { type: String },
        subtitle: { type: String }
    }],
    

    learning_title:{
        type: String,
    },
    learning_image:{
        type: String,
    },
    learning_subtitle:{
        type: String,
    },
    learning_description:{
        type: String,
    },

    learning_below_subtitle:{
        type: String,
    },
    learning_skill:[{
        title: { type: String },
    }],


    kordie_title:{
        type: String,
    },
    kordie_description:{
        type: String,
    },
    kordie_image:{
        type: String,
    },

    kordie_job_subtitle:{
        type: String,
    },
    kordie_job_section:[{
        image: {
            type: String,
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
    }],
    kordie_industries_title:{
        type: String,
    },
    kordie_industries_section:[{
        title: {
            type: String,
        }
    }],



    story_title:{
        type: String,
    },
    story_section:[{
        description: {
            type: String,
        },
        image: {
            type: String,
        }
    }],

    live_title:{
        type: String,
    },
    live_section:[{
        title: {
            type: String,
        },
        description: {
            type: String,
        }
    }],
    live_image:{
        type: String,
    },


    next_title: {
        type: String,
    },

    next_section: [
        {
          icon: {
              type: String,
          },
          image: {
            type: String,
          },
          title: {
              type: String,
          },
          description: {
              type: String,
          },
        },
    ],
    is_active: {
        type: Boolean,
        default: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });


// Validation middleware for array length
aboutSchema.pre('validate', function (next) {
    if (this.about_banner && this.about_banner.length > 3) {
        return next(new Error('about_banner cannot have more than 3 items.'));
    }
    if (this.world_subsection && this.world_subsection.length > 3) {
        return next(new Error('world_subsection cannot have more than 3 items.'));
    }
    if (this.kordie_job_section && this.kordie_job_section.length > 3) {
        return next(new Error('kordie_job_section cannot have more than 3 items.'));
    }
    if (this.live_section && this.live_section.length > 7) {
        return next(new Error('live_section cannot have more than 7 items.'));
    }
    if (this.next_section && this.next_section.length > 3) {
        return next(new Error('next_section cannot have more than 3 items.'));
    }
    next();
});



aboutSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    if (update.about_banner && update.about_banner.length > 3) {
        return next(new Error('about_banner cannot have more than 3 items.'));
    }
    if (update.world_subsection && update.world_subsection.length > 3) {
        return next(new Error('world_subsection cannot have more than 3 items.'));
    }
    if (update.kordie_job_section && update.kordie_job_section.length > 3) {
        return next(new Error('kordie_job_section cannot have more than 3 items.'));
    }
    if (update.live_section && update.live_section.length > 7) {
        return next(new Error('live_section cannot have more than 7 items.'));
    }
    if (update.next_section && update.next_section.length > 3) {
        return next(new Error('next_section cannot have more than 3 items.'));
    }
    next();
});

// Middleware to enforce only one record in the collection
aboutSchema.pre('save', async function (next) {
    if (this.isNew) { 
    const existingRecord = await mongoose.model('about').findOne();
    if (existingRecord) {
        return next(new Error('A record already exists. Please delete the existing record before adding a new one.'));
    }
    }
    next();
});

module.exports = mongoose.model('about', aboutSchema);