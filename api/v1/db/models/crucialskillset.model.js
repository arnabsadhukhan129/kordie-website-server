const mongoose = require('mongoose');

const crucialskillsetSchema = new mongoose.Schema({
  heading: { type: String }, // Section Heading
  title: { type: String, required: true }, // e.g., "Greatest influence on travel choices"
  key: { type: String, unique: true, required: true }, // Unique identifier, e.g., "travel_choices"
  description: { type: String }, // Section Description
  media: { type: String }, // Section Description
  type:{type: String, enum:['image','video'] },
  category_id : {
        type : mongoose.Types.ObjectId,
        default : null
      },
  stats: [
    {
      percentage: { type: Number}, // e.g., 75, 76, etc.
      text: { type: String}, // Content for the stats
    },
  ],
  count:{
    tye: { type: String},
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  is_active: {
      type: Boolean,
      default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('crucialskillset', crucialskillsetSchema);
