const express = require('express');
const ImpactController = require('../controllers/impact.controller');
const Router = express.Router();
const { HomeMiddleware } = require('../middlewares');

// Create Impact
Router.post('/create', HomeMiddleware.isCorrect, ImpactController.createImpact);

// Get All Impacts
Router.get('/get-all', ImpactController.getAllImpacts);

// Get Single Impact
Router.get('/get-single/:id', ImpactController.getSingleImpact);

// Update Impact
Router.put('/update/:id', HomeMiddleware.isCorrect, ImpactController.updateImpact);

// Delete Impact
Router.delete('/delete/:id', HomeMiddleware.isCorrect, ImpactController.deleteImpact);

// Toggle Active Status
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, ImpactController.toggleStatus);

module.exports = Router;
