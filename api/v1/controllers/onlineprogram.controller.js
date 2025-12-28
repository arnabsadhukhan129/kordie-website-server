const onlineProgramService = require('../services/onlineProgram.service');

const onlineprogramController = {
    async createProgram(req, res) {
        try {
            const Data = req.body;

        
            if (!Data || Object.keys(Data).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: ' data is required',
                });
            }

            
            const savedProgram = await onlineProgramService.createProgram(Data);

            // Return success response
            res.status(201).json({
                success: true,
                message: 'Online Program created successfully',
                data: savedProgram,
            });
        } catch (error) {
            // Handle errors
            res.status(400).json({
                success: false,
                message: error.message || 'An error occurred while creating the Program',
            });
        }
    },




        async getAllProgram(req, res) {
        try {
            const { page = 1, limit = 10 , sort, ...filters } = req.query;
            const result = await onlineProgramService.getAllProgram({
                page: Number(page),
                limit: Number(limit),
                sort,
                filters
            });
            res.status(200).json({
                success: true,
                message: 'Program retrieved successfully',
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving Program'
            });
        }
    },
//For title of all Exclusive Program
    async getAllExclusiveProgram(req, res) {
        try {
            const { page = 1, limit = 10 , sort, ...filters } = req.query;
            const result = await onlineProgramService.getAllExclusiveProgram({
                page: Number(page),
                limit: Number(limit),
                sort,
                filters
            });
            res.status(200).json({
                success: true,
                message: 'Program retrieved successfully',
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving Program'
            });
        }
    },


      // Get a single Program by ID
    async getProgramById(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Program ID is required',
                });
            }

            const Program = await onlineProgramService.getProgramById(id);

            if (!Program) {
                return res.status(404).json({
                    success: false,
                    message: 'Program not found',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Program retrieved successfully',
                data: Program,
            });
        } catch (error) {
            console.error('Error in getProgramById:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving Program by ID',
            });
        }
    },



//      // Update a Course by ID
     async updateProgram(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Program ID is required',
                });
            }

            if (!updateData || Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Update data is required',
                });
            }

            const updatedProgram = await onlineProgramService.updateProgram(id, updateData);

            if (!updatedProgram) {
                return res.status(404).json({
                    success: false,
                    message: 'Program not found',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Program updated successfully',
                data: updatedProgram,
            });
        } catch (error) {
            console.error('Error in updateProgram:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error updating Program',
            });
        }
    },

//     // Delete a Program by ID

    async deleteProgram(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Program ID is required',
                });
            }

            const deletedProgram = await onlineProgramService.deleteProgram(id);

            if (!deletedProgram) {
                return res.status(404).json({
                    success: false,
                    message: 'Program not found',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Program deleted successfully',
                data: deletedProgram,
            });
        } catch (error) {
            console.error('Error in deleteProgram:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error deleting Program',
            });
        }
    }
};





module.exports = onlineprogramController;