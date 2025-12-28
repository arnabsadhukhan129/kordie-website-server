const Learningcontent = require('../db/models/learn-kordie.model');
const Curatorscontent = require('../db/models/meet-your-curators.model');
const Studentscontent = require('../db/models/students-speaks-for-us.model');
const { CommonLib } = require('../../../lib');
const s3Service = require('./s3.service'); 

class homePageService{


    /**Why Learn with Kordie............................................. */

    /**Create Learn Kordie Content */
    async createLearnKordieContent(data, file, iconFile) {
        const sameTitle = await Learningcontent.findOne({title: data.title});

        if (sameTitle) {
            return {status:400, error_message:'This title already exists'};
        }
        const contentData = { ...data };

        if (file) {
            const videoUrl = await s3Service.uploadFile(file, 'media');
            contentData.media = videoUrl;
        }

        if(iconFile){
            const iconUrl = await s3Service.uploadFile(iconFile, 'icon');
            contentData.icon = iconUrl;
        }

        const allowedTypes = ['image','video'];
        if (contentData.type && !allowedTypes.includes(contentData.type)) {
            throw new Error('Invalid type value, It should be either image or video');
        }
        const content = new Learningcontent(contentData);
        return await content.save();
    }


   /**View Learn Kordie all Content */
    async getAllLearnKordieContent({ page, limit, title, active, sortby}) {
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
            total = await Learningcontent.countDocuments(query);
    
            // Calculate pagination
            pagination = CommonLib.getPagination(page, limit, total);
    
            // Retrieve users with pagination and type filter
            content = await Learningcontent.find(query)
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
            total = await Learningcontent.countDocuments(query);
    
            // Retrieve users with or without type filter
            content = await Learningcontent.find(query).sort(sort);
        }
    
        // Now you have the total count and pagination based on the 'type' variable.
        return { content, pagination };
    }


    /** Update Learn Kordie Content */
    async updateLearnKordieContent(id, data, file, iconFile) {
        const existingContent = await Learningcontent.findById(id);
    
        if (!existingContent) {
            return { status: 404, error_message: 'data not found' };
        }
    
        const contentData = { ...data };
    
        if (file) {
            const videoUrl = await s3Service.uploadFile(file, 'media');
            contentData.media = videoUrl; 
        }
    
        if(iconFile){
            const iconUrl = await s3Service.uploadFile(iconFile, 'icon');
            contentData.icon = iconUrl;
        }

        const allowedTypes = ['image','video'];
        if (contentData.type && !allowedTypes.includes(contentData.type)) {
            throw new Error('Invalid type value, It should be either image or video');
        }
        console.log(contentData);
        const updatedContent = await Learningcontent.findByIdAndUpdate(id, contentData, { new: true }); 
        return updatedContent;
    }

    /** View Learn Kordie Content by ID */
    async getLearnKordieContentById(id) {
        const content = await Learningcontent.findById(id);
    
        if (!content || !content.is_active) { 
            return { status: 404, error_message: 'Content not found or inactive' };
        }
    
        return content;
    }
    

    // async deleteLearnKordieContent(id) {
    //     const existingContent = await Learningcontent.findById(id);
    
    //     if (!existingContent) {
    //         return { status: 404, error_message: 'Content not found' };
    //     }
    
    //     await Learningcontent.findByIdAndDelete(id);
    //     return { status: 200, message: 'Data deleted successfully' };
    // }


    /** Delete Learn Kordie Content */
    async deleteLearnKordieContent(id) {
        const existingContent = await Learningcontent.findById(id);
    
        if (!existingContent) {
            return { status: 404, error_message: 'Content not found' };
        }

        await Learningcontent.findByIdAndDelete(id); // Remove from DB
        
        return { status: 200, message: 'Data deleted successfully' };
    }

  

    /**Meet your Curators.................................................... */

    /**Create Meet your Curators Content */
    async createMeetCuatorsContent(data, file) {
        const sameName = await Curatorscontent.findOne({name: data.name});

        if (sameName) {
            return {status:400, error_message:'This name already exists'};
        }
        const curatorsContentData = { ...data };

        if (file) {
            const imageUrl = await s3Service.uploadFile(file, 'image');
            curatorsContentData.image = imageUrl;
        }
        const curatorsContent = new Curatorscontent(curatorsContentData);
        return await curatorsContent.save();
    }

    /**View Meet your Curators all Content */
    async  getAllMeetCuatorsContent({ page, limit, name, active, sortby}) {
        const aggregate = {is_deleted:false};
        let content = [];
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
            total = await Curatorscontent.countDocuments(query);
    
            // Calculate pagination
            pagination = CommonLib.getPagination(page, limit, total);
    
            // Retrieve users with pagination and type filter
            content = await Curatorscontent.find(query)
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
            total = await Curatorscontent.countDocuments(query);
    
            // Retrieve users with or without type filter
            content = await Curatorscontent.find(query).sort(sort);
        }
    
        // Now you have the total count and pagination based on the 'type' variable.
        return { content, pagination };
    }

    /** Update Meet your Curators Content */
    async updateMeetCuatorsContent(id, data, file) {
        const existingCuratorsContent = await Curatorscontent.findById(id);
    
        if (!existingCuratorsContent) {
            return { status: 404, error_message: 'data not found' };
        }
    
        const curatorsContentData = { ...data };
        
        if (file) {
            const imageUrl = await s3Service.uploadFile(file, 'image');
            curatorsContentData.image = imageUrl; 
        }
        const updatedCuratorsContent = await Curatorscontent.findByIdAndUpdate(id, curatorsContentData, { new: true }); 
        return updatedCuratorsContent;
    }

    /** Delete Meet your Curators Content */
    async deleteMeetCuatorsContent(id) {
        const existingContent = await Curatorscontent.findById(id);
    
        if (!existingContent) {
            return { status: 404, error_message: 'Content not found' };
        }
    
        await Curatorscontent.findByIdAndDelete(id); // Remove from DB
        return { status: 200, message: 'Data deleted successfully' };
    }

     /** View Meet your Curators Content by ID */
     async getMeetCuatorsContentById(id) {
        const content = await Curatorscontent.findById(id);
    
        if (!content || !content.is_active) { 
            return { status: 404, error_message: 'Content not found or inactive' };
        }
    
        return content;
    }

    /**Students Speaks for Us.................................................... */

    /**Create Students Speaks for Us Content */
    async createStudentsSpeaksForUsContent(data, file) {
        const StudentsContentData = { ...data };

        if (file) {
            const StudentsImageUrl = await s3Service.uploadFile(file, 'image');
            StudentsContentData.image = StudentsImageUrl;
        }
        const StudentsContent = new Studentscontent(StudentsContentData);
        return await StudentsContent.save();
    }

    /**View Students Speaks for Us all Contents  */
    async getAllStudentsSpeaksForUsContent() {
        return await Studentscontent.find({ isActive: true }, { image: 0 });
    }

    /** View Students Speaks for Us Content by ID */
    async getAllStudentsSpeaksForUsContentById(id) {
        const content = await Studentscontent.findById(id);
    
        if (!content || !content.isActive) { 
            return { status: 404, error_message: 'Content not found or inactive' };
        }
    
        return content;
    }

    /** Update  Students Speaks for Us Content */
    async updateStudentsSpeaksForUsContent(id, data, file) {
        const existingContentData = await Studentscontent.findById(id);
    
        if (!existingContentData) {
            return { status: 404, error_message: 'data not found' };
        }
    
        const contentData = { ...data };
        
        if (file) {
            const imageUrl = await s3Service.uploadFile(file, 'image');
            contentData.image = imageUrl; 
        }
        const updatedContentData = await Studentscontent.findByIdAndUpdate(id, contentData, { new: true }); 
        return updatedContentData;
    }

    /** Delete Students Speaks for Us Content */
    async deleteStudentsSpeaksForUsContent(id) {
        const existingContent = await Studentscontent.findById(id);
    
        if (!existingContent) {
            return { status: 404, error_message: 'Content not found' };
        }
    
        existingContent.isActive = false; 
        await existingContent.save();
        
        return { status: 200, message: 'Data deleted successfully' };
    }
}

module.exports = new homePageService();