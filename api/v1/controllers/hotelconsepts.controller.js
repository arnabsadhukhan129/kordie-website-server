const { default: mongoose } = require('mongoose');
const HotelConseptsService = require('../services/hotelconsepts.service');
const onlineProgramService = require('../services/onlineProgram.service');
const hotelconseptscontroller = {
    async createEntry (req, res)  {
        try {
          const data=req.body
          const newEntry = await HotelConseptsService.createHotelConcepts(data);
          res.status(201).json({
            success: true,
            data: newEntry,
            message: 'Hotel concepts entry created successfully.'
          });
        } catch (error) {
          const status = error.status || 500;
          const message = error.message || 'Internal server error';
          
          res.status(status).json({
            success: false,
            error: message
          });
        }
      },
    

      async getAllHotelConcepts(req, res, next) {
        try {
          // Destructure query parameters with defaults; any extra query parameters become filters
          const { page = 1, limit = 10, sort, ...filters } = req.query;
          console.log("Filters from request:", filters);
    
          // Call the service to retrieve data
          const result = await HotelConseptsService.getAllHotelConcepts({
            page: Number(page),
            limit: Number(limit),
            sort,
            filters,
          });
    
          res.status(200).json({
            success: true,
            message: 'Hotel concepts retrieved successfully',
            data: result.data,
            pagination: result.pagination,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving Hotel concepts records',
          });
        }
      },


      async getHotelConceptsById(req, res) {
        try {
          const { id } = req.params;
          const record = await HotelConseptsService.getHotelConceptsById(id);
    
          if (!record) {
            return res.status(404).json({
              success: false,
              message: 'Hotel concepts record not found',
            });
          }
    
          res.status(200).json({
            success: true,
            message: 'Hotel concepts record retrieved successfully',
            data: record,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving Hotel concepts record',
          });
        }
      },

      async getHotelConceptsBySlug(req, res) {
        try {
          
          const record = await HotelConseptsService.getHotelConceptsBySlug(req.params.slug,req.user?.discount);
    
          if (!record) {
            return res.status(404).json({
              success: false,
              message: 'Hotel concepts record not found',
            });
          }
    
          res.status(200).json({
            success: true,
            message: 'Hotel concepts record retrieved successfully',
            data: record,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving Hotel concepts record',
          });
        }
      },

      async updateHotelConcepts(req, res) {
        try {
          const { id } = req.params;
          const updatedData = req.body;
           if(updatedData.is_featured){
            updatedData.featured_at = new Date()
          }
          const updatedRecord = await HotelConseptsService.updateHotelConcepts(id, updatedData);
         
          if (!updatedRecord) {
            return res.status(404).json({
              success: false,
              message: 'Hotel concepts record not found',
            });
          }
          const programId  = new mongoose.Types.ObjectId(id);
          const onlinePrograms = await onlineProgramService.getOnlinePrograms();
            
          if (!onlinePrograms) {
            await onlineProgramService.createProgram({courseId: [programId]});
          }
          else if (onlinePrograms && !onlinePrograms.courseId.some((course) => course.toString() === programId.toString())) {
            await onlineProgramService.updateProgram(onlinePrograms._id, {$push : { courseId: programId }});
          }
      
          res.status(200).json({
            success: true,
            message: 'Hotel concepts record updated successfully',
            data: updatedRecord,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error updating Hotel concepts record',
          });
        }
      },


      async deleteHotelConcepts(req, res) {
        try {
          const { id } = req.params;
          const deletedRecord = await HotelConseptsService.deleteHotelConcepts(id);
    
          if (!deletedRecord) {
            return res.status(404).json({
              success: false,
              message: 'Hotel Consepts record not found',
            });
          }
    
          res.status(200).json({
            success: true,
            message: 'Hotel Consepts record deleted successfully',
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error deleting sHotel Consepts record',
          });
        }
      },
      

}
module.exports = hotelconseptscontroller;