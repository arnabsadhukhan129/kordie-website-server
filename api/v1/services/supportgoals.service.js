const { SupportGoals } = require('../db/models');
const s3Service = require('./s3.service'); 
const { CommonLib } = require('../../../lib');
const SupportGoalsService = {
    async createSupportGoals(data, file) {
        const supportGoalsData = { title: data.title, link: data.link, description:data.description };

        const existing = await SupportGoals.findOne({ title: data.title});
        if (existing) {
            throw new Error('Title already exists');
        }

        if (file) {
            const imageUrl = await s3Service.uploadFile(file, 'images');
            supportGoalsData.image = imageUrl;
        }

        const newSupportGoal = new SupportGoals(supportGoalsData);
        return await newSupportGoal.save();
    },

    async deleteSupportGoals(id) {
        const supportGoal = await SupportGoals.findById(id);

        if (!supportGoal) {
            throw new Error('Support Goal not found');
        }

        await SupportGoals.findByIdAndDelete(id);
        return supportGoal;
    },

    async editSupportGoals(id, data, file) {
        const supportGoal = await SupportGoals.findById(id);

        if (!supportGoal) {
            throw new Error('Support Goal not found');
        }
        const existing = await SupportGoals.findOne({ title: data.title, _id: { $ne: id }});
        if (existing) {
            throw new Error('Title already exists');
        }
        supportGoal.title = data.title || supportGoal.title;
        supportGoal.link = data.link || supportGoal.link;
        supportGoal.description = data.description || supportGoal.description;
        if (file) {
            const imageUrl = await s3Service.uploadFile(file, 'images');
            supportGoal.image = imageUrl;
        }

        return await supportGoal.save();
    },

    async viewSupportGoals() {
        const supportGoal = await SupportGoals.findOne().sort({ createdAt: -1 });

        if (!supportGoal) {
            throw new Error('No support goals found');
        }

        return supportGoal;
    },

    async viewSupportGoalsId(id) {
        const supportGoal = await SupportGoals.findById(id);

        if (!supportGoal) {
            throw new Error('No support goals found');
        }

        return supportGoal;
    },

    async listSupportGoals({ page, limit, title, active, sortby}) {
        const aggregate = {is_deleted:false};
        let supportGoals = [];
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
            total = await SupportGoals.countDocuments(query);
    
            // Calculate pagination
            pagination = CommonLib.getPagination(page, limit, total);
    
            // Retrieve users with pagination and type filter
            supportGoals = await SupportGoals.find(query)
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
            total = await SupportGoals.countDocuments(query);
    
            // Retrieve users with or without type filter
            supportGoals = await SupportGoals.find(query).sort(sort);
        }
    
        // Now you have the total count and pagination based on the 'type' variable.
        return { supportGoals, pagination };
    },
};

module.exports = SupportGoalsService;
