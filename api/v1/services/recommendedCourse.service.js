const RecommendedCourse = require('../db/models/recommended-courses.model');
const { CommonLib } = require('../../../lib');
const recommendedCourseService = {
    // Service to create a new Courcse entry
    async createCourcse(Data) {
        try {
            const newCourcse = new RecommendedCourse(Data);
            const savedCourcse = await newCourcse.save();
            return savedCourcse;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    
    // Service to get all Courcse entries
 async getAllCourcse ({ page, limit, sort, filters })  {
    if (filters && filters.title) {
        filters.title = { $regex: new RegExp(filters.title, 'i') };
      }
        const query = RecommendedCourse.find(filters);
      
        if (sort) {
          query.sort(sort);
        }
    
        const total = await RecommendedCourse.countDocuments(filters);
      
        const data = await query
          .skip((page - 1) * limit)
          .limit(limit);
      
        const pagination = CommonLib.getPagination(page, limit, total);
      
        return { data, pagination };
      },


    // get a single Courcse entry by ID

    async getCourseById(id) {
        try {
            return await RecommendedCourse.findById(id).lean();
        } catch (error) {
            throw new Error('Invalid or non-existent Courcse ID');
        }
    },


    async updateCourse(id, updateData) {
        try {
            const updatedCourse = await RecommendedCourse.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean();
            return updatedCourse;
        } catch (error) {
            throw new Error('Invalid or non-existent Course ID');
        }
    },

    async deleteCourse(id) {
        try {
            const deletedCourse = await RecommendedCourse.findByIdAndDelete(id).lean();
            return deletedCourse;
        } catch (error) {
            throw new Error('Invalid or non-existent Course ID');
        }
    },
    
    };

module.exports = recommendedCourseService;

