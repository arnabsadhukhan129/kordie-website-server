const recommendedCourseService = require('../services/recommendedCourse.service');

const recommendedCourseController = {
    async createCourcse(req, res) {
        try {
            const Data = req.body;

        
            if (!Data || Object.keys(Data).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: ' data is required',
                });
            }

            
            const savedCourse = await recommendedCourseService.createCourcse(Data);

            // Return success response
            res.status(201).json({
                success: true,
                message: 'Course created successfully',
                data: savedCourse,
            });
        } catch (error) {
            // Handle errors
            res.status(400).json({
                success: false,
                message: error.message || 'An error occurred while creating the course',
            });
        }
    },




        async getAllCourses(req, res) {
        try {
            const { page = 1, limit = 10 , sort, ...filters } = req.query;
            const result = await recommendedCourseService.getAllCourcse({
                page: Number(page),
                limit: Number(limit),
                sort,
                filters
            });
            res.status(200).json({
                success: true,
                message: 'Course retrieved successfully',
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving Course'
            });
        }
    },


      // Get a single Course by ID
    async getCourseById(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Course ID is required',
                });
            }

            const Course = await recommendedCourseService.getCourseById(id);

            if (!Course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Course retrieved successfully',
                data: Course,
            });
        } catch (error) {
            console.error('Error in getCourseById:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving Course by ID',
            });
        }
    },



//      // Update a Course by ID
     async updateCourse(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Course ID is required',
                });
            }

            if (!updateData || Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Update data is required',
                });
            }

            const updatedCourse = await recommendedCourseService.updateCourse(id, updateData);

            if (!updatedCourse) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Course updated successfully',
                data: updatedCourse,
            });
        } catch (error) {
            console.error('Error in updateCourse:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error updating Course',
            });
        }
    },

//     // Delete a Course by ID

    async deleteCourse(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Course ID is required',
                });
            }

            const deletedCourse = await recommendedCourseService.deleteCourse(id);

            if (!deletedCourse) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Course deleted successfully',
                data: deletedCourse,
            });
        } catch (error) {
            console.error('Error in deleteCourse:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error deleting Course',
            });
        }
    }
};





module.exports = recommendedCourseController;