const Router = require('express').Router();
const TestimonialController = require('../controllers/testimonial.controller');
const {HomeMiddleware} = require('../middlewares');
Router.post('/create', HomeMiddleware.isCorrect, TestimonialController.createTestimonial);
Router.get('/get-all', TestimonialController.getAllTestimonial);
Router.get('/get-single/:id', TestimonialController.getSingleTestimonial);
Router.delete('/delete/:id', HomeMiddleware.isCorrect, TestimonialController.deleteTestimonial);
Router.put('/update/:id', HomeMiddleware.isCorrect, TestimonialController.updateTestimonial);
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, TestimonialController.toggleStatus);

module.exports = Router;