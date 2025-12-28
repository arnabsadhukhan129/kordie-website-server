const Router = require('express').Router();
const {HomeMiddleware} = require('../middlewares');
const SanaController = require('../controllers/sana.controller');

Router.post('/process-user',HomeMiddleware.isCorrect,SanaController.createSana);
Router.get('/by-tags', HomeMiddleware.isCorrect, SanaController.getSanaCourses);
Router.get('/get-all', SanaController.getSanaAllCourses);
Router.get('/get-course/:id', HomeMiddleware.isCorrect,SanaController.getSanaSingleCourse);



module.exports = Router;