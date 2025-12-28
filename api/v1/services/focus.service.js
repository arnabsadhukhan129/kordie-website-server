const AppConfig = require('../../../config/app.config');
const { NotFoundError } = require('../../../errors/http/http.errors');
const { CommonLib } = require('../../../lib');
const { TopicFocused } = require('../db/models');
const mongoose = require('mongoose');
const s3Service = require('./s3.service'); 
const FocusService = {

// Create Focused
async createFocused(data) {
        // Extract only the fields from `data` that you want to save in the model
        const focusData = {
            logo: data.logo
        };
    
   

    const newFocused = new TopicFocused(focusData);
    return await newFocused.save();
},

// Delete Focused
async deleteFocused(id) {
    const focus = await TopicFocused.findById(id);

    if (!focus) {
        throw new Error('Logo not found');
    }

    // Optionally, you can perform a soft delete by setting a flag
    await TopicFocused.findByIdAndDelete(id); // Remove from DB

    return focus;
},



// Edit Focused
async editFocused(id, data) {
    const focus = await TopicFocused.findById(id);

    if (!focus) {
        throw new Error('Logo not found');
    }

    // Update hospitality fields
    focus.logo = data.logo || focus.logo;

    return await focus.save();
},

// View the most recent Focused entry
async viewFocused(id) {
    const focus = await TopicFocused.findById(id);

    if (!focus) {
        throw new Error('No logo found');
    }

    // Returning the most recent hospitality entry
    return focus;
},



async listFocused({ page, limit, title, active, sortby}) {
    const aggregate = {is_deleted:false};
    let focus = [];
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
        total = await TopicFocused.countDocuments(query);

        // Calculate pagination
        pagination = CommonLib.getPagination(page, limit, total);

        // Retrieve users with pagination and type filter
        focus = await TopicFocused.find(query)
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
        total = await TopicFocused.countDocuments(query);

        // Retrieve users with or without type filter
        focus = await TopicFocused.find(query).sort(sort);
    }

    // Now you have the total count and pagination based on the 'type' variable.
    return { focus, pagination };
},

    

};

module.exports = FocusService;