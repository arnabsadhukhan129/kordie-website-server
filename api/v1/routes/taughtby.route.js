const express = require('express');
const TaughtByController = require('../controllers/taughtby.controller');
const Router = express.Router();
const { HomeMiddleware } = require('../middlewares');

// Create TaughtBy
Router.post('/create', HomeMiddleware.isCorrect, TaughtByController.createTaughtBy);

// Get All TaughtBy
Router.get('/get-all', TaughtByController.getAllTaughtBy);

// Get Single TaughtBy by ID
Router.get('/get-single/:id', TaughtByController.getSingleTaughtBy);

// Update TaughtBy
Router.put('/update/:id', HomeMiddleware.isCorrect, TaughtByController.updateTaughtBy);

// Delete TaughtBy
Router.delete('/delete/:id', HomeMiddleware.isCorrect, TaughtByController.deleteTaughtBy);

// Toggle Active Status
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, TaughtByController.toggleStatus);

module.exports = Router;
