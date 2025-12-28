const mongoose = require('mongoose');

const ContactBannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // e.g., "Greatest influence on travel choices"
    description: { type: String }, // Section Description
    image: { type: String }, // Image URL
    stats: [
      {
        title: { type: String }, 
        link: { type: String }, 
      },
    ],
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

const ContactBanner = mongoose.model('contactbanner', ContactBannerSchema);
module.exports = ContactBanner;
