const Router = require('express').Router();
const LearningTrackController = require('../controllers/learningtrack.controller');
const {HomeMiddleware} = require('../middlewares');
Router.post('/create',  HomeMiddleware.isCorrect, LearningTrackController.createLearningTrack);
Router.get('/get-all', LearningTrackController.getAllLearningTracks);
Router.get('/get-single/:id', LearningTrackController.getSingleLearningTrack);
Router.delete('/delete/:id',  HomeMiddleware.isCorrect, LearningTrackController.deleteLearningTrack);
Router.put('/update/:id',  HomeMiddleware.isCorrect, LearningTrackController.updateLearningTrack);
Router.put('/:id/toggle-status',  HomeMiddleware.isCorrect, LearningTrackController.toggleStatus);

module.exports = Router;
