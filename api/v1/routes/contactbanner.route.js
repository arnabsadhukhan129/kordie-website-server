const express = require('express');
const ContactBannerController = require('../controllers/contactbanner.controller');
const Router = express.Router();
const { HomeMiddleware } = require('../middlewares');

// Create Contact Banner
Router.post('/create', HomeMiddleware.isCorrect, ContactBannerController.createContactBanner);

// Get All Contact Banners
Router.get('/get-all', ContactBannerController.getAllContactBanners);

// Get Single Contact Banner by ID
Router.get('/get-single/:id', ContactBannerController.getSingleContactBanner);

// Update Contact Banner
Router.put('/update/:id', HomeMiddleware.isCorrect, ContactBannerController.updateContactBanner);

// Delete Contact Banner
Router.delete('/delete/:id', HomeMiddleware.isCorrect, ContactBannerController.deleteContactBanner);

// Toggle Active Status
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, ContactBannerController.toggleStatus);

module.exports = Router;
