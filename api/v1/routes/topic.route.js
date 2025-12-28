const express = require('express');
const TopicController = require('../controllers/topic.controller');
const Router = express.Router();
const { HomeMiddleware } = require('../middlewares');

// Create Topic
Router.post('/create', HomeMiddleware.isCorrect, TopicController.createTopic);

// Get All Topics
Router.get('/get-all', TopicController.getAllTopics);

// Get Single Topic by ID
Router.get('/get-single/:id', TopicController.getSingleTopic);

// Update Topic
Router.put('/update/:id', HomeMiddleware.isCorrect, TopicController.updateTopic);

// Delete Topic
Router.delete('/delete/:id', HomeMiddleware.isCorrect, TopicController.deleteTopic);

// Toggle Active Status
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, TopicController.toggleStatus);

module.exports = Router;
