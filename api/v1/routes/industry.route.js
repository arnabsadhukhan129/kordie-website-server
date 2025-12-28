const express = require('express');
const IndustryController = require('../controllers/industry.controller');
const Router = express.Router();
const { HomeMiddleware } = require('../middlewares');

// Create Industry
Router.post('/create', HomeMiddleware.isCorrect, IndustryController.createIndustry);

// Get All Industry
Router.get('/get-all', IndustryController.getAllIndustry);

// Get Single Industry by ID
Router.get('/get-single/:id', IndustryController.getSingleIndustry);

// Update Industry
Router.put('/update/:id', HomeMiddleware.isCorrect, IndustryController.updateIndustry);

// Delete Industry
Router.delete('/delete/:id', HomeMiddleware.isCorrect, IndustryController.deleteIndustry);

// Toggle Active Status
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, IndustryController.toggleStatus);

module.exports = Router;