const express = require('express');
const onlineprogramController = require('../controllers/onlineprogram.controller');
const Router = express.Router();
const { HomeMiddleware } = require('../middlewares');

// Create 
Router.post('/create', HomeMiddleware.isCorrect, onlineprogramController.createProgram);

// // Get All  
Router.get('/get-all', onlineprogramController.getAllProgram);

////  /// Get ALL For EXclusive
Router.get('/get-exclusive', onlineprogramController.getAllExclusiveProgram);

// // // // Get Single 
Router.get('/get-single/:id', onlineprogramController.getProgramById);

// // // // Update 
Router.put('/update/:id', HomeMiddleware.isCorrect, onlineprogramController.updateProgram);

// // // // Delete 
Router.delete('/delete/:id', HomeMiddleware.isCorrect, onlineprogramController.deleteProgram);

// // Toggle Active Status
// Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, AboutController.toggleStatus);

module.exports = Router;
