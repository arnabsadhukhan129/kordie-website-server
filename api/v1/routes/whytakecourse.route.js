//---------------------NOW USING INSIDE PRODUCT PAGE________________________________________


const express = require('express');
const WhyTakeCourseController = require('../controllers/whytakecourse.controller');
const Router = express.Router();
const { HomeMiddleware } = require('../middlewares');

Router.post('/create', HomeMiddleware.isCorrect, WhyTakeCourseController.create);
Router.get('/get-all', WhyTakeCourseController.getAll);
Router.get('/get-single/:id', WhyTakeCourseController.getSingle);
Router.put('/update/:id', HomeMiddleware.isCorrect, WhyTakeCourseController.update);
Router.delete('/delete/:id', HomeMiddleware.isCorrect, WhyTakeCourseController.delete);
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, WhyTakeCourseController.toggleStatus);

module.exports = Router;
