const homePageController = require('../controllers/homePage.controller');
const Router = require('express').Router();
const {HomeMiddleware} = require('../middlewares');
Router.post('/create-studentsspeak', HomeMiddleware.isCorrect, homePageController.createStudentsSpeaksForUsContent);
Router.get('/list-studentsspeak', homePageController.getAllStudentsSpeaksForUsContent);
Router.get('/view-studentsspeak/:id', homePageController.getAllStudentsSpeaksForUsContentById);
Router.put('/edit-studentsspeak/:id', HomeMiddleware.isCorrect, homePageController.updateStudentsSpeaksForUsContent);
Router.delete('/delete-studentsspeak/:id', HomeMiddleware.isCorrect, homePageController.deleteStudentsSpeaksForUsContent);
module.exports = Router;