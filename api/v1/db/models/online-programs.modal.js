const mongoose = require('mongoose');

const onlineprogramSchema = new mongoose.Schema({
  courseId: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }],
 
},{ timestamps: true });


module.exports = mongoose.model('onlineprogram', onlineprogramSchema);

