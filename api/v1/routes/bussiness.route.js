const express = require('express');
const BussinessController = require('../controllers/bussiness.controller');
const Router = express.Router();
const { HomeMiddleware } = require('../middlewares');

// Create About
Router.post('/create', HomeMiddleware.isCorrect, BussinessController.createBusiness);

// // Get All About Records
Router.get('/get-all', BussinessController.getAllBusinesses);

// // Get Single About
Router.get('/get-single/:id', BussinessController.getBusinessById);

// // Update About
Router.put('/update/:id', HomeMiddleware.isCorrect, BussinessController.updateBusiness);

// // Delete About
Router.delete('/delete/:id', HomeMiddleware.isCorrect, BussinessController.deleteBusiness);

// // Toggle Active Status
// Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, AboutController.toggleStatus);

module.exports = Router;
