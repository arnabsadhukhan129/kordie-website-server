const express = require('express');
const FaqsController = require('../controllers/faqs.controller');
const Router = express.Router();
const { HomeMiddleware } = require('../middlewares');

// Create FAQ
Router.post('/create', HomeMiddleware.isCorrect, FaqsController.createFaq);

// Get All FAQs
Router.get('/get-all', FaqsController.getAllFaqs);

// Get Single FAQ by ID
Router.get('/get-single/:id', FaqsController.getSingleFaq);

// Update FAQ
Router.put('/update/:id', HomeMiddleware.isCorrect, FaqsController.updateFaq);

// Delete FAQ
Router.delete('/delete/:id', HomeMiddleware.isCorrect, FaqsController.deleteFaq);

// Toggle Active Status
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, FaqsController.toggleStatus);

module.exports = Router;
