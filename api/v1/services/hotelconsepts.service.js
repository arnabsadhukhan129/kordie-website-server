const { NotFoundError } = require('../../../errors/http/http.errors');
const { CommonLib, StringLib, envs } = require("../../../lib");
const  Hotelconcepts  = require('../db/models/hotel-concepts.model');

function removeHtmlTags(str) {
  if (typeof str === 'string') {
    return str.replace(/<[^>]*>/g, '');
  }
  return str;
}
const hotelConceptsService = {
    async createHotelConcepts (data) {
        try {
          // const sanitizedCourseName = removeHtmlTags(data.course_name);
          //             const course_slug = StringLib.generateSlug(sanitizedCourseName);
          //  if (!data.course_name) {
          //         throw { status: 400, message: 'Title is required to generate course_slug.' };
          //       }
                
          //       data.course_slug = course_slug;
                
          //       // Optionally, check if the slug was generated correctly.
          //       if (!data.course_slug) {
          //         throw { status: 400, message: 'Failed to generate course_slug from the title.' };
          //       }
          const hotelConcepts = new Hotelconcepts(data);
          await hotelConcepts.save();
          return hotelConcepts;
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

      async getAllHotelConcepts ({ page, limit, sort, filters })  {
        // Build the query from filters
        const query = Hotelconcepts.find(filters);
      
        if (sort) {
          query.sort(sort);
        }
      
        // Count total documents matching the filters
        const total = await Hotelconcepts.countDocuments(filters);
      
        // Fetch the paginated data
        const data = await query
          .skip((page - 1) * limit)
          .limit(limit);
      
        // Use your custom pagination library to compute pagination details
        const pagination = CommonLib.getPagination(page, limit, total);
      
        return { data, pagination };
      },

      async getHotelConceptsById(id) {
        try {
          // You can add additional logic here if needed (e.g., validation)
          const record = await Hotelconcepts.findById(id).lean();
          return record;
        } catch (error) {
          throw new Error(error.message || 'Error fetching record by ID');
        }
      },

      async getHotelConceptsBySlug(slug) {
        try {
          // You can add additional logic here if needed (e.g., validation)
          const record = await Hotelconcepts.findOne({course_slug: slug}).lean();
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
      
    
      async updateHotelConcepts(id, updatedData) {
        try {
          // const sanitizedCourseName = removeHtmlTags(updatedData.course_name);
          //             const course_slug = StringLib.generateSlug(sanitizedCourseName);
          // if (!updatedData.course_name) {
          //   throw { status: 400, message: 'Title is required to generate course_slug.' };
          // }
          
          // updatedData.course_slug = course_slug;
          
          // // Optionally, check if the slug was generated correctly.
          // if (!updatedData.course_slug) {
          //   throw { status: 400, message: 'Failed to generate course_slug from the title.' };
          // }
          const updatedRecord = await Hotelconcepts.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
          });
          return updatedRecord;
        } catch (error) {
          throw new Error(error.message || 'Error updating Hotel concepts record');
        }
      },

      async deleteHotelConcepts(id) {
        try {
          const deletedRecord = await Hotelconcepts.findByIdAndDelete(id);
          return deletedRecord;
        } catch (error) {
          throw new Error(error.message || 'Error deleting Hotel concepts record');
        }
      }

}
module.exports = hotelConceptsService;