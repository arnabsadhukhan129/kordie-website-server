const Business = require('../db/models/for-business.modal');
const { CommonLib } = require('../../../lib');
const BussinessService = {
    // Service to create a new business entry
    async createBusiness(businessData) {
        try {
            // Check if a business with the same title already exists
            const existingBusiness = await Business.findOne({ new_world_title: businessData.new_world_title });
            if (existingBusiness) {
                throw new Error('A business  already exists.');
            }
    
            // Create and save the new business
            const newBusiness = new Business(businessData);
            const savedBusiness = await newBusiness.save();
            return savedBusiness;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    
    // Service to get all business entries

    async getAllBusinesses({ page, limit, sort, filters }) {
        try {
            const filterQuery = {};
            
            // 1. Build Filter Query
            if (filters.title) {
                filterQuery.new_world_title = { $regex: new RegExp(filters.title, 'i') };
            }
            // Add more filters as needed...
    
            // 2. Create Sort Object (convert "-createdAt" to { createdAt: -1 })
            const sortOrder = {};
            if (sort) {
                sort.split(',').forEach(sortField => {
                    const [field, order] = sortField.startsWith('-') 
                        ? [sortField.substring(1), -1] 
                        : [sortField, 1];
                    sortOrder[field] = order;
                });
            } else {
                sortOrder.createdAt = -1; // Default sort
            }
    
            const skip = (page - 1) * limit;
    
            // 3. Aggregation Pipeline
            const aggregationPipeline = [
                { $match: filterQuery },
                {
                    $lookup: {
                        from: 'industries', // Collection name (usually lowercase plural)
                        localField: 'industry_tab',
                        foreignField: '_id',
                        as: 'industry_tab'
                    }
                },
                { $sort: sortOrder },
                { $skip: skip },
                { $limit: limit }
            ];
    
            // 4. Execute Aggregation
            const [data, total] = await Promise.all([
                Business.aggregate(aggregationPipeline),
                Business.countDocuments(filterQuery)
            ]);
    
            //const totalPages = Math.ceil(total / limit);
            const pagination = CommonLib.getPagination(page, limit, total);
            return {
                data,
                pagination: page && limit ? pagination : null,
            
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // get a single business entry by ID

    async getBusinessById(id) {
        try {
            return await Business.findById(id).lean();
        } catch (error) {
            throw new Error('Invalid or non-existent Business ID');
        }
    },


    async updateBusiness(id, updateData) {
        try {
            const updatedBusiness = await Business.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean();
            return updatedBusiness;
        } catch (error) {
            throw new Error('Invalid or non-existent Business ID');
        }
    },

    async deleteBusiness(id) {
        try {
            const deletedBusiness = await Business.findByIdAndDelete(id).lean();
            return deletedBusiness;
        } catch (error) {
            throw new Error('Invalid or non-existent Business ID');
        }
    },
    
    };

module.exports = BussinessService;

