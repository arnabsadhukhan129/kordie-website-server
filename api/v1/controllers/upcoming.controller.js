const upcomingService = require("../services/upcoming.service");

const upcomingController = {
    async createEntry (req, res)  {
        try {
          const newEntry = await upcomingService.createUpcoming(req.body);
          res.status(201).json({
            success: true,
            data: newEntry,
            message: 'Upcoming Courses entry created successfully.'
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
    

      async getAll(req, res, next) {
        try {
          
          const { page = 1, limit = 10, sort, ...filters } = req.query;
          
          const result = await upcomingService.getAllupcoming({
            page: Number(page),
            limit: Number(limit),
            sort,
            filters,
          });
    
          res.status(200).json({
            success: true,
            message: 'Upcoming Courses retrieved successfully',
            data: result.data,
            pagination: result.pagination,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving Upcoming Courses',
          });
        }
      },


      async getUpcomingById(req, res) {
        try {
          const { id } = req.params;
          const record = await upcomingService.getUpcomingId(id);
    
          if (!record) {
            return res.status(404).json({
              success: false,
              message: 'Upcoming course record not found',
            });
          }
    
          res.status(200).json({
            success: true,
            message: 'Upcoming course record retrieved successfully',
            data: record,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving Upcoming course record',
          });
        }
      },

    //   async getSustainabilityByslug(req, res) {
    //     try {
         
    //       const record = await sustainabilityService.getSustainabilityBySlug(req.params.slug,req.user?.discount);
    
    //       if (!record) {
    //         return res.status(404).json({
    //           success: false,
    //           message: 'sustainability record not found',
    //         });
    //       }
    
    //       res.status(200).json({
    //         success: true,
    //         message: 'sustainability record retrieved successfully',
    //         data: record,
    //       });
    //     } catch (error) {
    //       res.status(500).json({
    //         success: false,
    //         message: error.message || 'Error retrieving sustainability record',
    //       });
    //     }
    //   },

      async update(req, res) {
        try {
          const { id } = req.params;
          const updatedData = req.body;
          const updatedRecord = await upcomingService.updateUpcoming(id, updatedData);
      
          if (!updatedRecord) {
            return res.status(404).json({
              success: false,
              message: 'Upcoming courses record not found',
            });
          }
      
          res.status(200).json({
            success: true,
            message: 'Upcoming courses updated successfully',
            data: updatedRecord,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error updating Upcoming courses record',
          });
        }
      },


      async delete(req, res) {
        try {
          const { id } = req.params;
          const deletedRecord = await upcomingService.deleteUpcoming(id);
    
          if (!deletedRecord) {
            return res.status(404).json({
              success: false,
              message: 'Upcoming courses record not found',
            });
          }
    
          res.status(200).json({
            success: true,
            message: 'Upcoming courses record deleted successfully',
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Error deleting Upcoming courses record',
          });
        }
      },
      

}
module.exports = upcomingController;