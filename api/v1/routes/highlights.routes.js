const express = require('express');
const HighlightsController = require('../controllers/highlights.controller');
const Router = express.Router();
const {HomeMiddleware} = require('../middlewares');
// Create Highlight
Router.post('/create', HomeMiddleware.isCorrect, HighlightsController.createHighlight);

// Get All Highlights
Router.get('/get-all', HighlightsController.getAllHighlights);

// Get Single Highlight by ID
Router.get('/get-single/:id', HighlightsController.getSingleHighlight);

// Update Highlight
Router.put('/update/:id', HomeMiddleware.isCorrect, HighlightsController.updateHighlight);

// Delete Highlight
Router.delete('/delete/:id', HomeMiddleware.isCorrect, HighlightsController.deleteHighlight);

// Toggle Active Status
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, HighlightsController.toggleStatus);

module.exports = Router;
