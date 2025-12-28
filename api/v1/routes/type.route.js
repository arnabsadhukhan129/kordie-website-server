const express = require('express');
const TypeController = require('../controllers/type.controller');
const Router = express.Router();
const { HomeMiddleware } = require('../middlewares');

// Create Type
Router.post('/create', HomeMiddleware.isCorrect, TypeController.createType);

// Get All Types
Router.get('/get-all', TypeController.getAllTypes);

// Get Single Type by ID
Router.get('/get-single/:id', TypeController.getSingleType);

// Update Type
Router.put('/update/:id', HomeMiddleware.isCorrect, TypeController.updateType);

// Delete Type
Router.delete('/delete/:id', HomeMiddleware.isCorrect, TypeController.deleteType);

// Toggle Active Status
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, TypeController.toggleStatus);

module.exports = Router;
