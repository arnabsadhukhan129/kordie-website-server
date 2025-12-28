const homePageController = require('../controllers/homePage.controller');
const Router = require('express').Router();
const {HomeMiddleware} = require('../middlewares');
Router.post('/create-learnwithkordie', HomeMiddleware.isCorrect, homePageController.createLearnKordieContent);
Router.get('/list-learnwithkordie', homePageController.getAllLearnKordieContent);
Router.put('/edit-learnwithkordie/:id', HomeMiddleware.isCorrect, homePageController.updateLearnKordieContent);
// Router.delete('/delete-learnwithkordie/:id', homePageController.deleteLearnKordieContent);
Router.delete('/delete-learnwithkordie/:id', HomeMiddleware.isCorrect, homePageController.deleteLearnKordieContent);
Router.get('/view-learnwithkordie/:id', homePageController.getLearnKordieContentById);

module.exports = Router;