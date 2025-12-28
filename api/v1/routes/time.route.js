const express = require('express');
const TimeController = require('../controllers/time.controller');
const Router = express.Router();
const { HomeMiddleware } = require('../middlewares');

// Create Time
Router.post('/create', HomeMiddleware.isCorrect, TimeController.createTime);

// Get All Times
Router.get('/get-all', TimeController.getAllTimes);

// Get Single Time by ID
Router.get('/get-single/:id', TimeController.getSingleTime);

// Update Time
Router.put('/update/:id', HomeMiddleware.isCorrect, TimeController.updateTime);

// Delete Time
Router.delete('/delete/:id', HomeMiddleware.isCorrect, TimeController.deleteTime);

// Toggle Active Status
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, TimeController.toggleStatus);

module.exports = Router;
