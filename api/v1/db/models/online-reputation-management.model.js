const mongoose = require("mongoose");
const onlineReputationManagementSchema = new mongoose.Schema(
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
            logo:{ type: String},
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
            title: { type: String },
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
      syllabus_title_subtitle_section: [
        {
            title: { type: String },
        }
      ],

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
    benefit_image: {
        type: String,
    },
    benefit_section:[
        {
            title: { type: String },
            description: { type: String }, 
        },
    ],
    online_reputation_management_title: { type: String},
    online_reputation_management_logo: { type: String},

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
  
    },
    { timestamps: true }
);


module.exports = mongoose.model("onlinereputationmanagement", onlineReputationManagementSchema);
