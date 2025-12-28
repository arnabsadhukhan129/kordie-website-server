const { default: mongoose } = require('mongoose');
const onlineProgramService = require('../services/onlineProgram.service');
const ScentMarketingService = require('../services/scentmarketing.service');
const ScentMarketingController = {
    async createEntry (req, res)  {
        try {
          const data=req.body
          console.log(data)
          const newEntry = await ScentMarketingService.createScentMarketing(data);
          res.status(201).json({
            success: true,
            data: newEntry,
            message: 'Scent Marketing entry created successfully.'
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
    

      async getAllScentMarketing(req, res, next) {
        try {
          // Destructure query parameters with defaults; any extra query parameters become filters
          const { page = 1, limit = 10, sort, ...filters } = req.query;
          console.log("Filters from request:", filters);

          // const discount = req.user.discount;
          // res.set('X-User-Discount', String(discount));
    
          // Call the service to retrieve data
          const result = await ScentMarketingService.getAllScentMarketing({
            page: Number(page),
            limit: Number(limit),
            sort,
            filters,
          });
    
          res.status(200).json({
            success: true,
            message: 'Scent marketing records retrieved successfully',
            data: result.data,
            pagination: result.pagination,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving scent marketing records',
          });
        }
      },


      async getScentMarketingById(req, res) {
        try {
          const { id } = req.params;
          const record = await ScentMarketingService.getScentMarketingById(id);
    
          if (!record) {
            return res.status(404).json({
              success: false,
              message: 'Scent marketing record not found',
            });
          }
    
          res.status(200).json({
            success: true,
            message: 'Scent marketing record retrieved successfully',
            data: record,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving scent marketing record',
          });
        }
      },

      async getScentMarketingBySlug(req, res) {
        try {
          
          const record = await ScentMarketingService.getScentMarketingBySlug(req.params.slug,req.user?.discount);
    
          if (!record) {
            return res.status(404).json({
              success: false,
              message: 'Scent marketing record not found',
            });
          }
    
          res.status(200).json({
            success: true,
            message: 'Scent marketing record retrieved successfully',
            data: record,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving scent marketing record',
          });
        }
      },


      async updateScentMarketing(req, res) {
        try {
          const { id } = req.params;
          const updatedData = req.body;
          if(updatedData.is_featured){
            updatedData.featured_at = new Date()
          }
          const updatedRecord = await ScentMarketingService.updateScentMarketing(id, updatedData);
          
          if (!updatedRecord) {
            return res.status(404).json({
              success: false,
              message: 'Scent marketing record not found',
            });
          }
        const programId  = new mongoose.Types.ObjectId(id);
        const onlinePrograms = await onlineProgramService.getOnlinePrograms();
         
        if (!onlinePrograms) {
          await onlineProgramService.createProgram({courseId: [programId]});
        }
        else if (onlinePrograms && !onlinePrograms.courseId.some((course) => course.toString() === programId.toString())) {
            await onlineProgramService.updateProgram(onlinePrograms._id, {
            $push: { courseId: programId }
          });
        }
          res.status(200).json({
            success: true,
            message: 'Scent marketing record updated successfully',
            data: updatedRecord,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error updating scent marketing record',
          });
        }
      },


      async deleteScentMarketing(req, res) {
        try {
          const { id } = req.params;
          const deletedRecord = await ScentMarketingService.deleteScentMarketing(id);
    
          if (!deletedRecord) {
            return res.status(404).json({
              success: false,
              message: 'Scent marketing record not found',
            });
          }
    
          res.status(200).json({
            success: true,
            message: 'Scent marketing record deleted successfully',
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error deleting scent marketing record',
          });
        }
      },
      

}
module.exports = ScentMarketingController;