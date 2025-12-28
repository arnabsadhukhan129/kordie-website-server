const express = require('express');
const GoalController = require('../controllers/goal.controller');
const Router = express.Router();
const { HomeMiddleware } = require('../middlewares');

// Create Goal
Router.post('/create', HomeMiddleware.isCorrect, GoalController.createGoal);

// Get All Goals
Router.get('/get-all', GoalController.getAllGoals);

// Get Single Goal by ID
Router.get('/get-single/:id', GoalController.getSingleGoal);

// Update Goal
Router.put('/update/:id', HomeMiddleware.isCorrect, GoalController.updateGoal);

// Delete Goal
Router.delete('/delete/:id', HomeMiddleware.isCorrect, GoalController.deleteGoal);

// Toggle Active Status
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, GoalController.toggleStatus);

module.exports = Router;
