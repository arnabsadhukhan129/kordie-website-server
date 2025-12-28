const express = require('express');
const recommendedCourseController = require('../controllers/recommendedCourse.controller');
const Router = express.Router();
const { HomeMiddleware } = require('../middlewares');

// Create About
Router.post('/create', HomeMiddleware.isCorrect, recommendedCourseController.createCourcse);

// // Get All  Records
Router.get('/get-all', recommendedCourseController.getAllCourses);

// // // Get Single 
Router.get('/get-single/:id', recommendedCourseController.getCourseById);

// // // Update 
Router.put('/update/:id', HomeMiddleware.isCorrect, recommendedCourseController.updateCourse);

// // // Delete 
Router.delete('/delete/:id', HomeMiddleware.isCorrect, recommendedCourseController.deleteCourse);

// // Toggle Active Status
// Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, AboutController.toggleStatus);

module.exports = Router;
