const AppConfig = require('../../../config/app.config');
const { NotFoundError } = require('../../../errors/http/http.errors');
const { CommonLib } = require('../../../lib');
const { Title } = require('../db/models');
const mongoose = require('mongoose');
const s3Service = require('./s3.service'); 
const TitleService = {
    async createTitle(data,file,vfile) {
        const topicdata = {
            //name: data.name.toLowerCase().trim(),
            name: data.name,
            subtitle: data.subtitle,
            description: data.description,
            url:data.url
        };
        const existingTitle = await Title.findOne({ name: topicdata.name, is_deleted: false });
    
        if (existingTitle) {
            // The name already exists, handle the case accordingly
            throw new Error('Name already exists'); 
        }

        if (file) {
            const imageUrl = await s3Service.uploadFile(file, 'images');
            topicdata.image = imageUrl;
        }

        if (vfile) {
            const imageUrl = await s3Service.uploadFile(vfile, 'videos');
            topicdata.video = imageUrl;
        }
        try {
            const newTitle = await Title.create(topicdata);
            return { message: 'Title created successfully', data: newTitle };
        } catch (error) {
            // Handle the error if the creation fails
            return { message: 'Error creating Title', data: error };
        }
        //return await TitleModel.create(data);
    },

    async updateTitle(topicId, updatedDetails, file, vfile) {
        const topicdata = {
            //name: updatedDetails.name.toLowerCase().trim(),
            name: updatedDetails.name,
            subtitle: updatedDetails.subtitle,
            description: updatedDetails.description,
            url:updatedDetails.url
        };
        const existingTitle = await Title.findOne({ name: topicdata.name, _id: { $ne: topicId }, is_deleted: false });
    
        if (existingTitle) {
            // The name already exists, handle the case accordingly
            throw new Error('Name already exists'); 
        }
        if (file) {
            const imageUrl = await s3Service.uploadFile(file, 'images');
            topicdata.image = imageUrl;
        }

        if (vfile) {
            const imageUrl = await s3Service.uploadFile(vfile, 'videos');
            topicdata.video = imageUrl;
        }
        const TitleEdit = await Title.findByIdAndUpdate(topicId, topicdata, { new: true });
        //console.log("pppppppppppppppppppppp"+topicId);
        if (!TitleEdit) {
            throw new Error('Title not found.');
        }

        return TitleEdit;
    },
  

    async  getTitles({ page, limit, name, active, sortby}) {
        const aggregate = {is_deleted:false};
        let topics = [];
        let offset;
        let total = null; // Initialize total as null
        let pagination = null;

        let sort = {};
        // Implement a switch-case statement
        switch (sortby) {
            case '1':
                sort = { name: 1 }
                break;
            case '2':
                sort = { name: -1 }
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
            if (name) {
                query.name = { $regex: new RegExp(name, 'i') };
            }
            if (active){
                query.is_active = active;
            }
    
            // Calculate the total count based on the query
            total = await Title.countDocuments(query);
    
            // Calculate pagination
            pagination = CommonLib.getPagination(page, limit, total);
    
            // Retrieve users with pagination and type filter
            topics = await Title.find(query)
                .sort(sort)
                .skip(offset)
                .limit(limit)
                ;
        } else {
            const query = aggregate;
            if (name) {
                query.name = { $regex: new RegExp(name, 'i') };
            }
           
            if (active){
               query.is_active = active;
            }
    
            // Calculate the total count based on the query
            total = await Title.countDocuments(query);
    
            // Retrieve users with or without type filter
            topics = await Title.find(query).sort(sort);
        }
    
        // Now you have the total count and pagination based on the 'type' variable.
        return { topics, pagination };
    },
    
    async getTitleById(topicId){
        const grade = await Title.findOne({_id: topicId});
        return grade;
    },

    async deleteTitle(topicId){
      
        try {
           const TitleDelete = await Title.findById(topicId);
            if (!TitleDelete) {
                throw new NotFoundError('Title not found.');
            }
            TitleDelete.is_deleted = true;
            await TitleDelete.save();
            const message= 'Title deleted successfully';
            return { TitleDelete, message };
        } catch (error) {
            throw error;
        }

        //return TitleDelete;
    },

    async toggleStatus(toggleId){
        try {
            //const schedulerId = req.params.id;
            const toggle = await Title.findById(toggleId);
            if (!toggle) {
                throw new NotFoundError('Not found');
            }
            toggle.is_active = !toggle.is_active;
            await toggle.save();
            const message= 'Status toggled successfully';
            return { toggle, message };
        } catch (error) {
            throw error;
        }
    },

    async toggleShow(toggleId){
        try {
            //const schedulerId = req.params.id;
            const toggle = await Title.findById(toggleId);
            if (!toggle) {
                throw new NotFoundError('Not found');
            }
            toggle.is_show = !toggle.is_show;
            await toggle.save();
            const message= 'Is show toggled successfully';
            return { toggle, message };
        } catch (error) {
            throw error;
        }
    },
    

};

module.exports = TitleService;