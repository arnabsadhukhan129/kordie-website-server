const Router = require('express').Router();
const {HomeMiddleware} = require('../middlewares');
const LearnWithKordieController = require('../controllers/learnwithkordie.controller');

Router.post('/create', HomeMiddleware.isCorrect, LearnWithKordieController.create);
Router.get('/get-all', LearnWithKordieController.getAll);
Router.get('/get/:key', LearnWithKordieController.getByKey);
Router.get('/get-single/:id', LearnWithKordieController.getById);
Router.put('/update/:id', HomeMiddleware.isCorrect,LearnWithKordieController.update);
Router.delete('/delete/:id', HomeMiddleware.isCorrect, LearnWithKordieController.delete);
Router.put('/:id/toggle-status',HomeMiddleware.isCorrect, LearnWithKordieController.toggleStatus);
Router.get('/get-title',LearnWithKordieController.getAllTitlesAndKeys);
module.exports = Router;