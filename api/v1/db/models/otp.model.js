const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  token_id: {
    type: String
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    ref:"users"
  },
  otp: {
    type: String
  },
  otp_phone: {
    type: String
  },
  reason: {
    type: String,
    default: null
  },
  exp_time: {
    type: Date
  },
  otp_invalidate: {
    type: String,
    enum: ['0', '1'],
    default: '0'
  }
}, {timestamps: true});

const Otp = mongoose.model('otp', otpSchema);

module.exports = Otp;
