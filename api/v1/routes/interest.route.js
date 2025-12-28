const express = require('express');
const InterestController = require('../controllers/interest.controller');
const Router = express.Router();
const { HomeMiddleware } = require('../middlewares');

// Create Interest
Router.post('/create', HomeMiddleware.isCorrect, InterestController.createInterest);

// Get All Interest
Router.get('/get-all', InterestController.getAllInterest);

// Get Single Interest by ID
Router.get('/get-single/:id', InterestController.getSingleInterest);

// Update Interest
Router.put('/update/:id', HomeMiddleware.isCorrect, InterestController.updateInterest);

// Delete Interest
Router.delete('/delete/:id', HomeMiddleware.isCorrect, InterestController.deleteInterest);

// Toggle Active Status
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, InterestController.toggleStatus);

module.exports = Router;