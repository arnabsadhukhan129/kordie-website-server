const { default: mongoose } = require('mongoose');
const AppConfig = require('../../../config/app.config');
const { NotFoundError } = require('../../../errors/http/http.errors');
const { CommonLib } = require('../../../lib');
const { LearnWithKordie } = require('../db/models');
const learnwithkordieModel = require('../db/models/learnwithkordie.model');
const s3Service = require('./s3.service'); 
const LearnWithKordieService = {
    // Create a new LearnWithKordie
    async create(data) {
        try {
            const existingSkillSet = await LearnWithKordie.findOne({ key: data.key });
            if (existingSkillSet) {
                throw new Error('Learn with kordie key already exists');
            }
            const newSkillSet = await LearnWithKordie.create(data);
            return { message: 'Learn with kordie created successfully', data: newSkillSet };
        } catch (error) {
            throw error;
        }
    },


    // Get all LearnWithKordies
    async getAll({ page, limit, title, active, sortby}) {
        const aggregate = {is_deleted:false};
        let learnwithkordie = [];
        const aggregationPipeline = [
            
            {
                $lookup : {
                    from : "coursecategories",
                    localField : "category_id",
                    foreignField : "_id",
                    as :"course_category_details"
                }
            },
            {
                $unwind : {
                    path : "$course_category_details",
                    preserveNullAndEmptyArrays : true
                }
            },
            {
                $set : {
                    category_name : "$course_category_details.name"
                }
            },
            {
                $unset : ["course_category_details"]
            },
            
        ]
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
            total = await LearnWithKordie.countDocuments(query);

            // Calculate pagination
            pagination = CommonLib.getPagination(page, limit, total);

            // Retrieve users with pagination and type filter
            // learnwithkordie = await LearnWithKordie.find(query)
            //     .sort(sort)
            //     .skip(offset)
            //     .limit(limit)
            //     ;
            learnwithkordie = await learnwithkordieModel.aggregate([
                {
                    $match : {
                        ...query
                    }
                },
                ...aggregationPipeline,
                {
                    $sort : {
                        ...sort
                    }
                },
                {
                    $skip : offset
                },
                {
                    $limit : limit
                }
            ])
        } else {
            const query = aggregate;
            if (title) {
                query.title = { $regex: new RegExp(title, 'i') };
            }

            if (active){
                query.is_active = active;
            }
        
            // Calculate the total count based on the query
            total = await LearnWithKordie.countDocuments(query);

            // Retrieve users with or without type filter
            learnwithkordie = await LearnWithKordie.aggregate([
                ...aggregationPipeline,
                {
                    $sort : {
                        ...sort
                    }
                },
            ]);
        }

        // Now you have the total count and pagination based on the 'type' variable.
        return { learnwithkordie, pagination };
    },

    // Get a LearnWithKordie by key
    async getByKey(key) {
        try {
        const aggregate = { category_id : new mongoose.Types.ObjectId(key), is_deleted:false};
        const aggregationPipeline = [
            {
                $match : {
                    ...aggregate
                }
            },
            {
                $lookup : {
                    from : "coursecategories",
                    localField : "category_id",
                    foreignField : "_id",
                    as :"course_category_details"
                }
            },
            {
                $unwind : {
                    path : "$course_category_details",
                    preserveNullAndEmptyArrays : true
                }
            },
            {
                $set : {
                    category_name : "$course_category_details.name"
                }
            },
            {
                $unset : ["course_category_details"]
            },
            
        ] 
            const skillSet = await LearnWithKordie.aggregate(aggregationPipeline);
            return skillSet;
        } catch (error) {
            throw error;
        }
    },


        // Get a LearnWithKordie by id
        async getById(id) {
        try {
            const aggregate = { _id : new mongoose.Types.ObjectId(id), is_deleted:false};
            const aggregationPipeline = [
            {
                $match : {
                    ...aggregate
                }
            },
            {
                $lookup : {
                    from : "coursecategories",
                    localField : "category_id",
                    foreignField : "_id",
                    as :"course_category_details"
                }
            },
            {
                $unwind : {
                    path : "$course_category_details",
                    preserveNullAndEmptyArrays : true
                }
            },
            {
                $set : {
                    category_name : "$course_category_details.name"
                }
            },
            {
                $unset : ["course_category_details"]
            },
            
            ] 
            const skillSet = await LearnWithKordie.aggregate(aggregationPipeline);
            return skillSet[0] || {};
        } catch (error) {
                throw error;
            }
        },

    // Update a LearnWithKordie by key
    async update(id, data) {
        try {
        // Check if a skill set with the same key exists (excluding the current one)
        const existingSkillSet = await LearnWithKordie.findOne({
            key: data.key,
            is_deleted: false,
            _id: { $ne: id },
        });
        if (existingSkillSet) {
            throw new Error('Learn with kordie already exists');
        }
            const updatedSkillSet = await LearnWithKordie.findByIdAndUpdate(id, data, { new: true });
            return updatedSkillSet;
        } catch (error) {
            throw error;
        }
    },

    // Delete a LearnWithKordie by key
    async delete(id) {
        try {
            const deletedSkillSet = await LearnWithKordie.findOneAndDelete({ _id:id });
            return deletedSkillSet;
        } catch (error) {
            throw error;
        }
    },


    async toggleStatus(id){
        try {
            //const schedulerId = req.params.id;
            const toggle = await LearnWithKordie.findOne({_id:id});
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

    async getAllTitlesAndKeys() {
        try {
            const skillSets = await LearnWithKordie.find(
                { is_deleted: false }, // Filter out deleted records
                { title: 1, key: 1, _id: 0 } // Project only title and key, exclude _id
            );
    
            return skillSets;
        } catch (error) {
            throw error;
        }
    }
    
};

module.exports = LearnWithKordieService;