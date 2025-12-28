const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        //required: true
    },
    user_type: {
        type: [{
            type: String,
            enum: ["admin", "product_manager","user","corporate_user","sub_admin", "guest_user"]
        }],
        required: true,
        default: ['user']

    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model for the creator
        default: null
    },
    phone: {
        type: String,
    },
    work_place: {
        type: String,
    },
    current_role: {
        type: String,
    },
    responsibility: {
        type: String,
    },
    about_us: {
        type: String,
    },
    topic:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
      }],
    product_news: {
        type: Boolean,
        default: false
    },
    data_updates: {
        type: Boolean,
        default: false
    },
    is_validated: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
      googleId: {
        type: String,
        allowNull: true,
      },
      googleTime: {
        type: Date,
      },
      microsoftId: {
        type: String,
        allowNull: true,
      },
      microsoftTime: {
        type: Date,
      },
      linkedinId: {
        type: String,
        allowNull: true,
      },
      linkedinTime: {
        type: Date,
      },
      appleId: {
        type: String,
        allowNull: true,
      },
      appleTime: {
        type: Date,
      },
      socialType: {
        type: String,
        allowNull: true,
      },
      picture: {
        type: String,
      },
      shortbio: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      twitter: {
        type: String,
      },
      goal:[{
        type: String,
      }],
      learn_from_kordie:{
        type: String,
      },
      language:{
        type: String,
      },
      location:{
        type: String,
      },
      timezone:{
        type: String,
      },
      sana_user_id:{
        type: String,
      },
      is_guest: {
        type: Boolean,
        default: false
      },
      notify_email: {
        type: String,
      },
      corporate_enquiry_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course_enrollment_enquiry', // Assuming you have a User model for the creator
        default: null
    },
    user_notify_email:[
      {
        email: {
          type: String,
        },
        phone: {
        type: String,
        },
        countrycode: {
          type: String,
        },
      }
    ],
    promotion_tips:{
      type: Boolean,
      default: false
    },
    account_updates:{
      type: Boolean,
      default: false
    },
    user_signup_step_done:{
      type: Boolean,
      default: false
    }
}, { timestamps: true });


// Define a virtual field for fullName
userSchema.virtual('fullName').get(function () {
    if (this.first_name || this.last_name) {
        return `${this.first_name} ${this.last_name}`.trim();
    }
    return this.name;
});

// // Instance method to check if the user has a specific role
// userSchema.methods.hasRole = function(role) {
//   return this.user_type.includes(role);
// };

const UserModel = mongoose.model('user', userSchema);
module.exports = UserModel;
