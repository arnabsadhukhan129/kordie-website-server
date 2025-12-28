const { NotFoundError } = require('../../../errors/http/http.errors');
const { CommonLib, StringLib, envs } = require("../../../lib");

const { Role } = require('../db/models');
// function removeHtmlTags(str) {
//   if (typeof str === 'string') {
//     return str.replace(/<[^>]*>/g, '');
//   }
//   return str;
// }

const RoleService = {
  async createRole(data) {
    try {
      const role = new Role(data);
      await role.save();
      return role;
    } catch (error) {
      if (error.message.includes('A record already exists')) {
        throw { status: 409, message: error.message };
      } else if (
        error.message.includes('cannot have more than') ||
        error.name === 'ValidationError'
      ) {
        throw { status: 400, message: error.message };
      }
      throw { status: 500, message: 'Internal server error' };
    }
  },

      async getAllScentMarketing  ({ page, limit, sort, filters })  {
        // Build the query from filters
        const query = ScentMarketing.find(filters);
      
        if (sort) {
          query.sort(sort);
        }
      
        // Count total documents matching the filters
        const total = await ScentMarketing.countDocuments(filters);
      
        // Fetch the paginated data
        const data = await query
          .skip((page - 1) * limit)
          .limit(limit);
      
        // Use your custom pagination library to compute pagination details
        const pagination = CommonLib.getPagination(page, limit, total);
      
        return { data, pagination };
      },

      async getScentMarketingById(id) {
        try {
          // You can add additional logic here if needed (e.g., validation)
          const record = await ScentMarketing.findById(id).lean();
          return record;
        } catch (error) {
          throw new Error(error.message || 'Error fetching record by ID');
        }
      },

      async getScentMarketingBySlug(slug, discount) {
        try {
          const record = await ScentMarketing.findOne({course_slug: slug}).lean();
          return record;
        } catch (error) {
          throw new Error(error.message || 'Error fetching record by slug');
        }
      },
      
    
      async updateScentMarketing(id, updatedData) {
        try {
           const sanitizedCourseName = removeHtmlTags(updatedData.course_name);
                                const course_slug = StringLib.generateSlug(sanitizedCourseName);
          if (!updatedData.course_name) {
            throw { status: 400, message: 'Title is required to generate course_slug.' };
          }
          
          updatedData.course_slug = course_slug;
          
          if (!updatedData.course_slug) {
            throw { status: 400, message: 'Failed to generate course_slug from the title.' };
          }
          const updatedRecord = await ScentMarketing.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
          });
          return updatedRecord;
        } catch (error) {
          throw new Error(error.message || 'Error updating scent marketing record');
        }
      },

      async deleteScentMarketing(id) {
        try {
          const deletedRecord = await ScentMarketing.findByIdAndDelete(id);
          return deletedRecord;
        } catch (error) {
          throw new Error(error.message || 'Error deleting scent marketing record');
        }
      }

}
module.exports = RoleService;