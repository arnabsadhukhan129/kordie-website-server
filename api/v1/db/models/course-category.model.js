const mongoose = require('mongoose');

const courseCategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  category_image:{type:String},
  herosection: {
    title: String,
    subtitle: String,
    description: String,
    media: String,
    type:{type: String, enum:['image','video'] },
    link: String,
    tags: [String]
  },
  crucialskillset:
  {
    title: String
  },
  productsection:{
    title: String,
    description: String,
  },
  brandsection: 
  {
      title: String,
      description: String,
      media: String,
      type:{type: String, enum:['image','video'] },
  },
  collectionsection:{
    title: String,
    description: String,
  },
  socialmedia:
  {
      name: String,
      image: String,
      description: String,
      link: String
  },
  whylearn:{
    title: String,
  },
  relatedmaterial:{
    title: String,
    description: String,
    link: String,
  },
  school:{
    title: String,
    description: String,
    media: String,
    type:{type: String, enum:['image','video'] },
  },
  faq:{
    title: String
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  is_active: {
      type: Boolean,
      default: true,
  },
}, { timestamps: true });

const CourseCategory = mongoose.model('coursecategory', courseCategorySchema);

module.exports = CourseCategory;
