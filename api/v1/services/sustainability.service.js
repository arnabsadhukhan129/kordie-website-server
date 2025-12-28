const { NotFoundError } = require('../../../errors/http/http.errors');
const { CommonLib ,StringLib} = require('../../../lib');
const  Sustainability  = require('../db/models/sustainability.model');
function removeHtmlTags(str) {
  if (typeof str === 'string') {
    return str.replace(/<[^>]*>/g, '');
  }
  return str;
}

const sustainabilityService = {
    async createSustainability (data) {
      
        try {
          //  const sanitizedCourseName = removeHtmlTags(data.course_name);
          //                             const course_slug = StringLib.generateSlug(sanitizedCourseName);
          //  if (!data.course_name) {
          //         throw { status: 400, message: 'Title is required to generate course_slug.' };
          //       }
                
          //       data.course_slug = course_slug;
                
              
          //       if (!data.course_slug) {
          //         throw { status: 400, message: 'Failed to generate course_slug from the title.' };
          //       }
          
          const sustainability = new Sustainability(data);
          await sustainability.save();
          return sustainability;
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

      async getAllSustainability ({ page, limit, sort, filters })  {
        // Build the query from filters
        const query = Sustainability.find(filters);
      
        if (sort) {
          query.sort(sort);
        }
      
        // Count total documents matching the filters
        const total = await Sustainability.countDocuments(filters);
      
        // Fetch the paginated data
        const data = await query
          .skip((page - 1) * limit)
          .limit(limit);
      
        // Use your custom pagination library to compute pagination details
        const pagination = CommonLib.getPagination(page, limit, total);
      
        return { data, pagination };
      },

      async getSustainabilityById(id) {
        try {
          // You can add additional logic here if needed (e.g., validation)
          const record = await Sustainability.findById(id).lean();
          return record;
        } catch (error) {
          throw new Error(error.message || 'Error fetching record by ID');
        }
      },

      async getSustainabilityBySlug(slug) {
        try {
          // You can add additional logic here if needed (e.g., validation)
          const record = await Sustainability.findOne({course_slug: slug}).lean();
          if(record) {
            record.course_type = {
              name: "Exclusive online program"
            };
            record.course_time = {
              name: record.enrol_single_duration
            }
          }
          return record;
        } catch (error) {
          throw new Error(error.message || 'Error fetching record by ID');
        }
      },
      
    
      async updateSustainability(id, updatedData) {
        try {
          //  const sanitizedCourseName = removeHtmlTags(updatedData.course_name);
          //                             const course_slug = StringLib.generateSlug(sanitizedCourseName);
          // if (!updatedData.course_name) {
          //             throw { status: 400, message: 'Title is required to generate course_slug.' };
          //           }
                    
          //           updatedData.course_slug = course_slug;
                    
          //           if (!updatedData.course_slug) {
          //             throw { status: 400, message: 'Failed to generate course_slug from the title.' };
          //           }
          const updatedRecord = await Sustainability.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
          });
          return updatedRecord;
        } catch (error) {
          throw new Error(error.message || 'Error updating Sustainability record');
        }
      },

      async deleteSustainability(id) {
        try {
          const deletedRecord = await Sustainability.findByIdAndDelete(id);
          return deletedRecord;
        } catch (error) {
          throw new Error(error.message || 'Error deleting  record');
        }
      }

}
module.exports = sustainabilityService;