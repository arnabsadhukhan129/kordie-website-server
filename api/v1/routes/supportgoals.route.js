const Router = require('express').Router();
const SupportGoalsController = require('../controllers/supportgoals.controller');
const {HomeMiddleware} = require('../middlewares');
Router.post('/create', HomeMiddleware.isCorrect, SupportGoalsController.createSupportGoals);
Router.put('/:id', HomeMiddleware.isCorrect, SupportGoalsController.editSupportGoals);
Router.delete('/:id', HomeMiddleware.isCorrect, SupportGoalsController.deleteSupportGoals);
Router.get('/list', SupportGoalsController.listSupportGoals);
Router.get('/:id', SupportGoalsController.viewSupportGoalsId);

module.exports = Router;
