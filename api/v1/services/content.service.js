const Content = require('../db/models/admin-content.model');
const s3Service = require('./s3.service'); 
const { CommonLib } = require('../../../lib');
class ContentService {
    async createContent(data) {
        const contentData = { ...data };
        const meta = {
            "title": "",
            "description": "",
            "keywords": []
        };

        meta.title = data.meta_title;
        meta.description = data.meta_description;
        //meta.keywords = data.meta_keywords;
        meta.keywords = Array.isArray(data.meta_keywords)
        ? data.meta_keywords
        : JSON.parse(data.meta_keywords);
        contentData.meta = meta;

        const existingUrl = await Content.findOne({ url: contentData.url, is_deleted: false });
    
        if (existingUrl) {
            // The title already exists, handle the case accordingly
            throw new Error('Url already exists'); 
        }

        
        const content = new Content(contentData);
        return await content.save();
    }

    async editContent(id, data) {
        // Find the content by its ID
        const content = await Content.findById(id);
        if (!content) {
            throw new Error('Content not found');
        }

        // Update content fields
        content.title = data.title || content.title;
        content.body = data.body || content.body;
        content.url = data.url || content.url;

        const meta = {
            title: data.meta_title || content.meta.title,
            description: data.meta_description || content.meta.description,
            keywords: data.meta_keywords ? data.meta_keywords : content.meta.keywords
        };
        content.meta = meta;

        // Update sections if provided
        if (Array.isArray(data.sections)) {
            content.sections = data.sections; // Replace the entire sections array
        }

            // Update images if provided
            if (Array.isArray(data.images)) {
                content.images = data.images; // Replace the entire images array
            }

            // Update videos if provided
            if (Array.isArray(data.videos)) {
                content.videos = data.videos; // Replace the entire videos array
            }

        const existingUrl = await Content.findOne({ url: content.url, _id: { $ne: id }, is_deleted: false });
    
        if (existingUrl) {
            // The title already exists, handle the case accordingly
            throw new Error('Url already exists'); 
        }

        

        // Save the updated content
        return await content.save();
    }

    // async editContent(id, data) {
    //     // Find the content by its ID
    //     const content = await Content.findById(id);
    //     if (!content) {
    //         throw new Error('Content not found');
    //     }
    
    //     // Update primitive fields
    //     content.title = data.title || content.title;
    //     content.body = data.body || content.body;
    //     content.url = data.url || content.url;
    
    //     // Merge meta fields
    //     content.meta = {
    //         title: data.meta_title || content.meta.title,
    //         description: data.meta_description || content.meta.description,
    //         keywords: data.meta_keywords || content.meta.keywords
    //     };
    
    //     // Handle sections incrementally
    //     if (Array.isArray(data.sections)) {
    //         data.sections.forEach((newSection) => {
    //             const existingIndex = content.sections.findIndex((section) => section._id?.toString() === newSection._id);
    //             if (existingIndex >= 0) {

    //                 if (!['text', 'image', 'video'].includes(newSection.type)) {
    //                     throw new Error(`Invalid section type: ${newSection.type}`);
    //                 }
                    
    //                 // Update existing section
    //                 content.sections[existingIndex] = { 
    //                     ...content.sections[existingIndex].toObject(), 
    //                     ...newSection 
    //                 };
    //             } else {
    //                 // Add new section
    //                 content.sections.push(newSection);
    //             }
    //         });
    //     }
    
    //     // Check for unique URL
    //     const existingUrl = await Content.findOne({ url: content.url, _id: { $ne: id }, is_deleted: false });
    //     if (existingUrl) {
    //         throw new Error('Url already exists');
    //     }
    
    //     // Save the updated content
    //     return await content.save();
    // }
    

    // Edit existing content by ID
    async updateContent(id, data) {
        const content = await Content.findByIdAndUpdate(id, data, { new: true });
        if (!content) throw new Error('Content not found');
        return content;
    }

    // Fetch content by URL
    async getContentByUrl(url) {
        const content = await Content.findOne({ url:'/'+url, is_active: true });
        if (!content) throw new Error('Content not found');
        return content;
    }




    async getSingleContent(id) {
        const content = await Content.findOne({_id: id});;
        if (!content) throw new Error('Content not found');
        return content;
    }

    // Toggle content active/inactive status
    async toggleActiveStatus(id) {
        const content = await Content.findById(id);
        if (!content) throw new Error('Content not found');
        content.is_active = !content.is_active;
        return await content.save();
    }


    async getAllContent({ page, limit, title, active, sortby}) {
        const aggregate = {is_deleted:false};
        let content = [];
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
            total = await Content.countDocuments(query);
    
            // Calculate pagination
            pagination = CommonLib.getPagination(page, limit, total);
    
            // Retrieve users with pagination and type filter
            content = await Content.find(query)
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
            total = await Content.countDocuments(query);
    
            // Retrieve users with or without type filter
            content = await Content.find(query).sort(sort);
        }
    
        // Now you have the total count and pagination based on the 'type' variable.
        return { content, pagination };
    }



    async uploadMedia(file) {
        try {
            if (file) {
                const mediaUrl = await s3Service.uploadFileOne(file, 'media');
                return { message: 'Media uploaded successfully', mediaUrl };
            }
        } catch (error) {
            // Handle the error if the creation fails
            return { message: 'Error creating Upload', data: error };
        }
    }

    async deleteMedia(key) {
        try {
            if (key) {
                const mediaUrl = await s3Service.deleteFromS3(key);
                return { message: 'Media deleted successfully', mediaUrl };
            }
        } catch (error) {
            // Handle the error if the creation fails
            return { message: 'Error creating Upload', data: error };
        }
    }
}

module.exports = new ContentService();