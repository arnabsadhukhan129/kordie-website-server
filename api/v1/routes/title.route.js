const Router = require('express').Router();
const {HomeMiddleware} = require('../middlewares');
const TitleController = require('../controllers/title.controller');

Router.post('/create',HomeMiddleware.isCorrect,TitleController.createTitle);
Router.get('/get-all',TitleController.getAllTitles);
Router.get('/get-single/:id',TitleController.getSingleTitle);
Router.delete('/delete/:id',HomeMiddleware.isCorrect,TitleController.deleteTitle);
Router.put('/update/:id',HomeMiddleware.isCorrect,TitleController.updateTitle);
Router.put('/:id/toggle-status',HomeMiddleware.isCorrect,TitleController.toggleStatus);
Router.put('/:id/toggle-show',HomeMiddleware.isCorrect,TitleController.toggleShow);
module.exports = Router;