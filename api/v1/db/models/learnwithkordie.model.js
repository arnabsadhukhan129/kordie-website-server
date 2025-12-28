const mongoose = require("mongoose");

const learnWithKordieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    key: { type: String, unique: true, required: true },
    description: { type: String }, 
    image: { type: String },
    icon: { type: String },
    category_id : {
      type : mongoose.Types.ObjectId,
      default : null
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("learnwithkordie", learnWithKordieSchema);
