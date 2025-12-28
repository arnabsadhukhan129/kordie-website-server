const Router = require('express').Router();
const FocusController = require('../controllers/focus.controller');
const {HomeMiddleware} = require('../middlewares');
// Routes for program endpoints
Router.post('/create', HomeMiddleware.isCorrect,FocusController.createFocused); // Create new program
Router.get('/list', FocusController.listFocused); 
Router.get('/:id', FocusController.viewFocused); // View program by ID
Router.put('/:id', HomeMiddleware.isCorrect, FocusController.editFocused); // Edit program
Router.delete('/:id', HomeMiddleware.isCorrect, FocusController.deleteFocused); // Delete program

module.exports = Router;