const mongoose = require("mongoose");
const sustainabilitySchema = new mongoose.Schema(
    {
        course_name: {
            type: String,
            required: true,
          },
          course_slug: {
            type: String,
            required: true,
          },
          course_description: {
            type: String,
          },
          course_category : {
            type : Array,
            default : []
          },
          sana_course_id:{
            type: String,
            required: true,
          },
          course_image: {
            type: String,
          },
          is_featured: {
            type: Boolean,
            default: false,
          },
          plan_duration:{
            type: Number,
          },
        // banner_title: {
        //     type: String,
        //     required: true,
        // },
        banner_icon_section: [
            {
                title: { type: String },
                image: { type: String },
                description: { type: String },
            },
        ],
        // banner_description: {
        //     type: String,
        //     required: true,
        // },
        banner_bottom_section: [{
            title: { type: String },
            description: { type: String },
        }],
        banner_media: {
            type: String, 
        },
        banner_type: {
            type: String,
            enum: ["video", "image"],
        },
        banner_bottom_section_media: {
            type: String,
        },
        banner_bottom_section_title: {
            type: String,
        },
        banner_bottom_section_description: {
            type: String,
        },
        banner_slide_data: [{
            title: { type: String },
            icon: { type: String },   
        }],

        program_overview_title: {
            type: String,
            // required: true,
        },
        program_overview_media: {
            type: String,
        },
        program_overview_type: {
            type: String,
            enum: ["video", "image"],
        },
        program_overview_description: {
            type: String,
            // required: true,
        },
        

        address_to_title: {
            type: String,
            // required: true,
        },
        address_to_subtitle: {
            type: String,
            // required: true,
        },
        address_to_list:[{
            title: { type: String },
            description: { type: String },
            // logo:{ type: String},
        }],
        address_to_media: {
            type: String,
        },
        address_to_type: {
            type: String,
            enum: ["video", "image"],
        },


        key_lerning_title: {
            type: String,
            // required: true,
        },
        key_lerning_area:[{
            
            description_list: [{ type: String }],
        }],

        enrol_section_title: [{
            title: { type: String },
        }],

        meet_author_title: {
            type: String,
            // required: true,
        },
        meet_author_title_subtitle: {
            type: String,
        },
        meet_author_subtitle_media: {
            type: String,
        },
        mett_author_description: {
            type: String,
        },
        meet_author_media: {
            type: String,
        },
        meet_author_logo:[{
            image:{ type: String} ,
           }],
      meet_author_program_description: {
        type: String,
      },
      
      mett_author_bottom_section: [
        {
          image: { type: String },
          title: { type: String },
          description: { type: String },
        },
      ],

      syllabus_title_icon: {
        type: String,
      },
      syllabus_title: {
        type: String,
        // required: true,
      },
    

      syllabus_accordion_block:[
        {
        time: { type: String },
        title: { type: String },
        description: { type: String },
        image: { type: String },
       content:[
         {
           title: { type: String },
         icon: { type: String },
         },
       ]
        },
      ],

      self_study_title: {
        type: String,
        // required: true,
      },
      self_study_description: {
        type: String,
      },
      self_study_section:[
        {
            title: { type: String },
            description: { type: String },
        },
    ],
    benefit_title: {
        type: String,
        // required: true,
    },
    benefit_description: {
        type: String,
    },
    benefit_image: {
        type: String,
    },
    benefit_section:[
        {
            title: { type: String },
            description: { type: String }, 
        },
    ],
    hotel_concept_title: { type: String},
    hotel_concept_logo: { type: String},

      sneak_peek_title: {
        type: String,
        // required: true,
      },
      sneak_peek_section:[
        {
            tab_title: { type: String },
            tab_content_title: { type: String },
            tab_content_media: { type: String },
            tab_content_type: { type: String, enum: ["video", "image"], },
        }
      ],


 
 

    enrol_title:{
        type: String,
        // required: true,
    },
    enrol_description:{
        type: String,
    },
    enrol_single_title:{
        type: String,
        // required: true,
    },
    enrol_single_duration:{
        type: Number,
        // required: true,
    },
    enrol_single_price:{
        type: Number,
        // required: true,
    },
    enrol_single_discount:{
        type: Number,
        // required: true,
    },
    enrol_single_plan_box:[{
        description: { type: String },
    }],

    certificate_title:{
        type: String,
        // required: true,
    },
    certificate_description:{
        type: String,
    },
    certificate_image:{
        type: String,
    },
    faq_title:{
        type: String,
        // required: true,
    },
    course_time: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Time',
     },
    featured_at : {
       type : Date,
       default : Date.now
     }
    },
    { timestamps: true }
);



// hotelConceptsSchema.pre('validate', function (next) {
//     if (this.banner_icon_section && this.banner_icon_section.length > 1) {
//         return next(new Error('banner_icon_section cannot have more than 1 items.'));
//     }
//     if (this.banner_bottom_section && this.banner_bottom_section.length > 3) {
//         return next(new Error('banner_bottom_section cannot have more than 3 items.'));
//     }
//     if (this.banner_slide_data && this.banner_slide_data.length > 5) {
//         return next(new Error('banner_slide_data cannot have more than 5 items.'));
//     }
//     if (this.address_to_taglist && this.address_to_taglist > 7) {
//         return next(new Error('address_to_taglist cannot have more than 7 items.'));
//     }
//     if (this.hospitality_area && this.hospitality_area.length > 2) {
//         return next(new Error('hospitality_area cannot have more than 2 items.'));
//     }
//     if (this.external_consultants_list && this.external_consultants_list.length > 8) {
//         return next(new Error('how_it_different_section cannot have more than 8 items.'));
//     }
//     if (this.meet_author_logo && this.meet_author_logo.length > 9) {
//         return next(new Error('meet_author_logo cannot have more than 9 items.'));
//     }
//     if (this.mett_author_bottom_section && this.mett_author_bottom_section.length > 4) {
//         return next(new Error('mett_author_bottom_section cannot have more than 4 items.'));
//     }
//     if (this.syllabus_title_subtitle_section && this.syllabus_title_subtitle_section.length > 3) {
//         return next(new Error('syllabus_title_subtitle_section cannot have more than 3 items.'));
//     }
//     if (this.sneak_peek_section && this.sneak_peek_section.length > 4) {
//         return next(new Error('sneak_peek_section cannot have more than 4 items.'));
//     }
//     if (this.business_impact_section && this.business_impact_section.length > 5) {
//         return next(new Error('business_impact_section cannot have more than 5 items.'));
//     }
//     if (this.enrol_single_plan_box && this.enrol_single_plan_box.length > 4) {
//         return next(new Error('enrol_single_plan_box cannot have more than 4 items.'));
//     }
//     next();
// });

// hotelConceptsSchema.pre('findOneAndUpdate', async function (next) {
//     const update = this.getUpdate();

//     if (update.banner_icon_section && update.banner_icon_section.length > 1) {
//         return next(new Error('banner_icon_section cannot have more than 1 items.'));
//     }
//     if (update.banner_bottom_section && update.banner_bottom_section.length > 3) {
//         return next(new Error('banner_bottom_section cannot have more than 3 items.'));
//     }
//     if (update.banner_slide_data && update.banner_slide_data.length > 5) {
//         return next(new Error('banner_slide_data cannot have more than 5 items.'));
//     }
//     if (update.address_to_taglist && update.address_to_taglist > 7) {
//         return next(new Error('address_to_taglist cannot have more than 7 items.'));
//     }
//     if (update.hospitality_area && update.hospitality_area.length > 2) {
//         return next(new Error('hospitality_area cannot have more than 2 items.'));
//     }
//     if (update.external_consultants_list && update.external_consultants_list.length > 8) {
//         return next(new Error('how_it_different_section cannot have more than 8 items.'));
//     }
//     if (update.meet_author_logo && update.meet_author_logo.length > 9) {
//         return next(new Error('meet_author_logo cannot have more than 9 items.'));
//     }
//     if (update.mett_author_bottom_section && update.mett_author_bottom_section.length > 4) {
//         return next(new Error('mett_author_bottom_section cannot have more than 4 items.'));
//     }
//     if (update.syllabus_title_subtitle_section && update.syllabus_title_subtitle_section.length > 3) {
//         return next(new Error('syllabus_title_subtitle_section cannot have more than 3 items.'));
//     }
//     if (update.sneak_peek_section && update.sneak_peek_section.length > 4) {
//         return next(new Error('sneak_peek_section cannot have more than 4 items.'));
//     }
//     if (update.business_impact_section && update.business_impact_section.length > 5) {
//         return next(new Error('business_impact_section cannot have more than 5 items.'));
//     }
//     if (update.enrol_single_plan_box && update.enrol_single_plan_box.length > 4) {
//         return next(new Error('enrol_single_plan_box cannot have more than 4 items.'));
//     }
//     next();
// });

// hotelConceptsSchema.pre('save', async function (next) {
//     if (this.isNew) { 
//     const existingRecord = await mongoose.model('hotelconcepts').findOne();
//     if (existingRecord) {
//         return next(new Error('A record already exists. Please delete the existing record before adding a new one.'));
//     }
//     }
//     next();
// });
const SustainabilityModel = mongoose.model("sustainability", sustainabilitySchema);
module.exports = SustainabilityModel;  // Export the model for use in other files
