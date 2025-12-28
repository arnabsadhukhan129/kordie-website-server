const businessService = require('../services/bussiness.service');

const BussinessController = {
    async createBusiness(req, res) {
        try {
            const businessData = req.body;

            if (!businessData || Object.keys(businessData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Business data is required',
                });
            }

            const savedBusiness = await businessService.createBusiness(businessData);

            res.status(201).json({
                success: true,
                message: 'Business created successfully',
                data: savedBusiness,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'An error occurred while creating the business',
            });
        }
    },



    async getAllBusinesses(req, res) {
        try {
            const { page = 1, limit = 10 , sort, ...filters } = req.query;
            console.log("Filters from request:", filters);
            // Get paginated businesses
            const result = await businessService.getAllBusinesses({
                page: Number(page),
                limit: Number(limit),
                sort,
                filters
            });

            res.status(200).json({
                success: true,
                message: 'Businesses retrieved successfully',
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving businesses'
            });
        }
    },


      // Get a single business by ID
      async getBusinessById(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Business ID is required',
                });
            }

            const business = await businessService.getBusinessById(id);

            if (!business) {
                return res.status(404).json({
                    success: false,
                    message: 'Business not found',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Business retrieved successfully',
                data: business,
            });
        } catch (error) {
            console.error('Error in getBusinessById:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving business by ID',
            });
        }
    },



     // Update a business by ID
     async updateBusiness(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Business ID is required',
                });
            }

            if (!updateData || Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Update data is required',
                });
            }

            const updatedBusiness = await businessService.updateBusiness(id, updateData);

            if (!updatedBusiness) {
                return res.status(404).json({
                    success: false,
                    message: 'Business not found',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Business updated successfully',
                data: updatedBusiness,
            });
        } catch (error) {
            console.error('Error in updateBusiness:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error updating business',
            });
        }
    },

    // Delete a business by ID

    async deleteBusiness(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Business ID is required',
                });
            }

            const deletedBusiness = await businessService.deleteBusiness(id);

            if (!deletedBusiness) {
                return res.status(404).json({
                    success: false,
                    message: 'Business not found',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Business deleted successfully',
                data: deletedBusiness,
            });
        } catch (error) {
            console.error('Error in deleteBusiness:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error deleting business',
            });
        }
    }
};





module.exports = BussinessController;