const express = require('express');
const AboutController = require('../controllers/about.controller');
const Router = express.Router();
const { HomeMiddleware } = require('../middlewares');

// Create About
Router.post('/create', HomeMiddleware.isCorrect, AboutController.createAbout);

// Get All About Records
Router.get('/get-all', AboutController.getAllAbout);

// Get Single About
Router.get('/get-single/:id', AboutController.getSingleAbout);

// Update About
Router.put('/update/:id', HomeMiddleware.isCorrect, AboutController.updateAbout);

// Delete About
Router.delete('/delete/:id', HomeMiddleware.isCorrect, AboutController.deleteAbout);

// Toggle Active Status
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, AboutController.toggleStatus);

module.exports = Router;
