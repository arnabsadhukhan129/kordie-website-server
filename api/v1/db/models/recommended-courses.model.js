const mongoose = require('mongoose');

const recommendedcourseSchema = new mongoose.Schema({
 tag:{
    type: 'string'
},
 title:{
    type:"string",
    required: true
 },
 descryption:{
    type: "string",
 },
 background_color:{
    type: "string",
 },
link_url:{
    type: "string",
}
}, { timestamps: true });

module.exports = mongoose.model('recommendedcourse', recommendedcourseSchema);
