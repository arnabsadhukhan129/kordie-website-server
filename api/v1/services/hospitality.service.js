const AppConfig = require('../../../config/app.config');
const { NotFoundError } = require('../../../errors/http/http.errors');
const { CommonLib } = require('../../../lib');
const { Hospitality } = require('../db/models');
const mongoose = require('mongoose');
const s3Service = require('./s3.service'); 
const HospitalityService = {

// Create Hospitality
async createHospitality(data, file) {
        // Extract only the fields from `data` that you want to save in the model
        const hospitalityData = {
            title: data.title,  // Only save the title
            type: data.type
        };

            // Check for duplicate title
        const existingHospitality = await Hospitality.findOne({ title: hospitalityData.title , is_deleted: false});
        if (existingHospitality) {
            throw new Error("A banner name with this title already exists, choose diffrent name");
        }
    
      if (file) {
            
        const imageUrl = await s3Service.uploadFile(file, 'media');
        hospitalityData.media = imageUrl;
      }
      const allowedTypes = ['image','video'];
      if (hospitalityData.type && !allowedTypes.includes(hospitalityData.type)) {
          throw new Error('Invalid type value, It should be either image or video');
      }
    const newHospitality = new Hospitality(hospitalityData);
    return await newHospitality.save();
},

// Delete Hospitality
async deleteHospitality(id) {
    const hospitality = await Hospitality.findById(id);

    if (!hospitality) {
        throw new Error('Hospitality not found');
    }

    // Optionally, you can perform a soft delete by setting a flag
    await Hospitality.findByIdAndDelete(id);; // Remove from DB

    return hospitality;
},



// Edit Hospitality
async editHospitality(id, data, file) {
    const hospitality = await Hospitality.findById(id);

    if (!hospitality) {
        throw new Error('Hospitality not found');
    }

     // Check for duplicate title (if title is being updated)
     if (data.title && data.title !== hospitality.title) {
        const existingHospitality = await Hospitality.findOne({ title: data.title, _id: { $ne: id }, is_deleted: false});
        if (existingHospitality) {
            throw new Error("A banner name entry with this title already exists.");
        }
    }

    // Update hospitality fields
    hospitality.title = data.title || hospitality.title;
    hospitality.type = data.type || hospitality.type;

    // Update images if new ones are uploaded
    if (file) {
        const imageUrl = await s3Service.uploadFile(file, 'media');
        hospitality.media = imageUrl;
      }

      const allowedTypes = ['image','video'];
      if (hospitality.type && !allowedTypes.includes(hospitality.type)) {
          throw new Error('Invalid type value, It should be either image or video');
      }

    return await hospitality.save();
},

// View the most recent Hospitality entry
async viewHospitality() {
    const hospitality = await Hospitality.findOne().sort({ createdAt: -1 });

    if (!hospitality) {
        throw new Error('No hospitality content found');
    }

    // Returning the most recent hospitality entry
    return hospitality;
},


async viewHospitalityId(id) {
    const hospitality = await Hospitality.findById(id);

    if (!hospitality) {
        throw new Error('No hospitality content found');
    }

    // Returning the most recent hospitality entry
    return hospitality;
},


async listHospitality({ page, limit, title, active, sortby}) {
    const aggregate = {is_deleted:false};
    let hospitality = [];
    let offset;
    let total = null; // Initialize total as null
    let pagination = null;

    let sort = {};
    // Implement a switch-case statement
    switch (sortby) {
        case '1':
            sort = { title: 1 }
            break;
        case '2':
            sort = { title: -1 }
            break;
        case '3':
            sort = { createdAt: 1 }
            break;
        case '4':
            sort = { createdAt: -1 }
            break;
        default:
            sort = { createdAt: 1 }
        }

    if (page && limit) {
        offset = CommonLib.getOffset(page, limit);
        const query = aggregate;
        if (title) {
            query.title = { $regex: new RegExp(title, 'i') };
        }

        if (active){
            query.is_active = active;
        }


        // Calculate the total count based on the query
        total = await Hospitality.countDocuments(query);

        // Calculate pagination
        pagination = CommonLib.getPagination(page, limit, total);

        // Retrieve users with pagination and type filter
        hospitality = await Hospitality.find(query)
            .sort(sort)
            .skip(offset)
            .limit(limit)
            ;
    } else {
        const query = aggregate;
        if (title) {
            query.title = { $regex: new RegExp(title, 'i') };
        }

        if (active){
            query.is_active = active;
        }
       
        // Calculate the total count based on the query
        total = await Hospitality.countDocuments(query);

        // Retrieve users with or without type filter
        hospitality = await Hospitality.find(query).sort(sort);
    }

    // Now you have the total count and pagination based on the 'type' variable.
    return { hospitality, pagination };
},

    

};

module.exports = HospitalityService;