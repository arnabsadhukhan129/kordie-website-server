const express = require('express');
const ContactContentController = require('../controllers/contactContent.controller');
const Router = express.Router();
const {HomeMiddleware} = require('../middlewares');
// Create ContactContent
Router.post('/create', HomeMiddleware.isCorrect, ContactContentController.createContactContent);

// Get All ContactContent
Router.get('/get-all', ContactContentController.getAllContactContents);

// Get Single ContactContent by ID
Router.get('/get-single/:id', ContactContentController.getSingleContactContent);


// Get Single ContactContent by ID
Router.get('/type/:type', ContactContentController.getSingleContactContentType);

// Update ContactContent
Router.put('/update/:id', HomeMiddleware.isCorrect, ContactContentController.updateContactContent);

// Delete ContactContent
Router.delete('/delete/:id', HomeMiddleware.isCorrect, ContactContentController.deleteContactContent);

// Toggle Active Status
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, ContactContentController.toggleStatus);


Router.get('/types',ContactContentController.contactDropdown);

module.exports = Router;
