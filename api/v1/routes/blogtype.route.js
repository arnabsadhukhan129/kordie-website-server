const express = require('express');
const BlogTypeController = require('../controllers/blogtype.controller');
const Router = express.Router();
const { HomeMiddleware } = require('../middlewares');

// Create Type
Router.post('/create', HomeMiddleware.isCorrect, BlogTypeController.createType);

// Get All Types
Router.get('/get-all', BlogTypeController.getAllTypes);

// Get Single Type by ID
Router.get('/get-single/:id', BlogTypeController.getSingleType);

// Update Type
Router.put('/update/:id', HomeMiddleware.isCorrect, BlogTypeController.updateType);

// Delete Type
Router.delete('/delete/:id', HomeMiddleware.isCorrect, BlogTypeController.deleteType);

// Toggle Active Status
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, BlogTypeController.toggleStatus);

module.exports = Router;
