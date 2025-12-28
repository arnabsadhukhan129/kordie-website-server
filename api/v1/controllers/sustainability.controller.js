const { default: mongoose } = require('mongoose');
const onlineProgramService = require('../services/onlineProgram.service');
const sustainabilityService = require('../services/sustainability.service');
const sustainabilityController = {
    async createEntry (req, res)  {
        try {
          const newEntry = await sustainabilityService.createSustainability(req.body);
          res.status(201).json({
            success: true,
            data: newEntry,
            message: 'Sustainability entry created successfully.'
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
    

      async getAllSustainability(req, res, next) {
        try {
          // Destructure query parameters with defaults; any extra query parameters become filters
          const { page = 1, limit = 10, sort, ...filters } = req.query;
          console.log("Filters from request:", filters);
    
          // Call the service to retrieve data
          const result = await sustainabilityService.getAllSustainability({
            page: Number(page),
            limit: Number(limit),
            sort,
            filters,
          });
    
          res.status(200).json({
            success: true,
            message: 'Sustainability retrieved successfully',
            data: result.data,
            pagination: result.pagination,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving Sustainability records',
          });
        }
      },


      async getSustainabilityById(req, res) {
        try {
          const { id } = req.params;
          const record = await sustainabilityService.getSustainabilityById(id);
    
          if (!record) {
            return res.status(404).json({
              success: false,
              message: 'sustainability record not found',
            });
          }
    
          res.status(200).json({
            success: true,
            message: 'sustainability record retrieved successfully',
            data: record,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving sustainability record',
          });
        }
      },

      async getSustainabilityByslug(req, res) {
        try {
         
          const record = await sustainabilityService.getSustainabilityBySlug(req.params.slug,req.user?.discount);
    
          if (!record) {
            return res.status(404).json({
              success: false,
              message: 'sustainability record not found',
            });
          }
    
          res.status(200).json({
            success: true,
            message: 'sustainability record retrieved successfully',
            data: record,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving sustainability record',
          });
        }
      },

      async updateSustainability(req, res) {
        try {
          const { id } = req.params;
          const updatedData = req.body;
          if(updatedData.is_featured){
            updatedData.featured_at = new Date()
          }
          const updatedRecord = await sustainabilityService.updateSustainability(id, updatedData);
      
          if (!updatedRecord) {
            return res.status(404).json({
              success: false,
              message: 'sustainability record not found',
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
            message: 'sustainability record updated successfully',
            data: updatedRecord,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error updating sustainability record',
          });
        }
      },


      async deleteSustainability(req, res) {
        try {
          const { id } = req.params;
          const deletedRecord = await sustainabilityService.deleteSustainability(id);
    
          if (!deletedRecord) {
            return res.status(404).json({
              success: false,
              message: 'Sustainability record not found',
            });
          }
    
          res.status(200).json({
            success: true,
            message: 'Sustainability record deleted successfully',
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error deleting Sustainability record',
          });
        }
      },
      

}
module.exports = sustainabilityController;