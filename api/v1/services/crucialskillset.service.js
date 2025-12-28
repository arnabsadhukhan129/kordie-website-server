const { default: mongoose } = require('mongoose');
const AppConfig = require('../../../config/app.config');
const { NotFoundError } = require('../../../errors/http/http.errors');
const { CommonLib } = require('../../../lib');
const { CrucialSkillSet } = require('../db/models');
const s3Service = require('./s3.service'); 
const CrucialSkillSetService = {
    // Create a new CrucialSkillSet
    async create(data) {
        try {
            const existingSkillSet = await CrucialSkillSet.findOne({ key: data.key });
            if (existingSkillSet) {
                throw new Error('Skill Set key already exists');
            }
            const newSkillSet = await CrucialSkillSet.create(data);
            return { message: 'Crucial Skill Set created successfully', data: newSkillSet };
        } catch (error) {
            throw error;
        }
    },


    // Get all CrucialSkillSets
    async getAll({ page, limit, title, active, sortby}) {
        const aggregate = {is_deleted:false};
        let skillset = [];
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
            total = await CrucialSkillSet.countDocuments(query);

            // Calculate pagination
            pagination = CommonLib.getPagination(page, limit, total);

            // Retrieve users with pagination and type filter
            // skillset = await CrucialSkillSet.find(query)
            //     .sort(sort)
            //     .skip(offset)
            //     .limit(limit)
            //     ;
            skillset = await CrucialSkillSet.aggregate([
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
            total = await CrucialSkillSet.countDocuments(query);

            // Retrieve users with or without type filter
            // skillset = await CrucialSkillSet.find(query).sort(sort);
            skillset = await CrucialSkillSet.aggregate([
                            ...aggregationPipeline,
                            {
                                $sort : {
                                    ...sort
                                }
                            },
                        ]);
        }


        // Now you have the total count and pagination based on the 'type' variable.
        return { skillset, pagination };
    },

    // Get a CrucialSkillSet by key
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
            // const skillSet = await CrucialSkillSet.findOne({ key });
            const skillSet = await CrucialSkillSet.aggregate(aggregationPipeline);
            
            return skillSet;
        } catch (error) {
            throw error;
        }
    },


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
                const skillSet = await CrucialSkillSet.aggregate(aggregationPipeline);
                return skillSet[0] || {};
            } catch (error) {
                    throw error;
                }
            },

    // Update a CrucialSkillSet by key
    async update(_id, data) {
        console.log("CHECk1====================>",data,_id)
        try {
        // Check if a skill set with the same key exists (excluding the current one)
        const existingSkillSet = await CrucialSkillSet.findOne({
            $and: [
                { _id: data._id },   // Check for the new key
                { _id: { $ne: _id } } // Exclude the current document using old key
            ]
        });
        if (existingSkillSet) {
            throw new Error('Skill Set key already exists');
        }
            const updatedSkillSet = await CrucialSkillSet.findOneAndUpdate({ _id }, data, { new: true });
            return updatedSkillSet;
        } catch (error) {
            throw error;
        }
    },

    // Delete a CrucialSkillSet by key
    async delete(_id) {
        try {
            const deletedSkillSet = await CrucialSkillSet.findOneAndDelete({ _id });
            return deletedSkillSet;
        } catch (error) {
            throw error;
        }
    },


    async toggleStatus(toggleId){
        try {
            //const schedulerId = req.params.id;
            const toggle = await CrucialSkillSet.findOne({key:toggleId});
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
            const skillSets = await CrucialSkillSet.find(
                { is_deleted: false }, // Filter out deleted records
                { title: 1, key: 1, _id: 0 } // Project only title and key, exclude _id
            );
    
            return skillSets;
        } catch (error) {
            throw error;
        }
    }
    
};

module.exports = CrucialSkillSetService;