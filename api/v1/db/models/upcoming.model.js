const mongoose = require('mongoose');
const monthEnum = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

const upcomingSchema = new mongoose.Schema({
    tag:{
         type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String, 
    },
    time: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
        enum: ['2025','2026' ]
    },
    month: {
        type: String,
        enum: monthEnum,
        required: true
      },

  categeoryId: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }],
  is_deleted: {
    type: Boolean,
    default: false
  },
 
},{ timestamps: true });


module.exports = mongoose.model('upcoming', upcomingSchema);

