const Router = require('express').Router();
const DeliveryController = require('../controllers/delivery.controller');
const {HomeMiddleware} = require('../middlewares');
// Routes for program endpoints
Router.post('/create', HomeMiddleware.isCorrect,DeliveryController.createDelivery); // Create new program
Router.get('/list', DeliveryController.listDelivery); // View program by ID

Router.get('/', DeliveryController.viewDelivery); // View program by ID
Router.put('/:id', HomeMiddleware.isCorrect,DeliveryController.editDelivery); // Edit program
Router.delete('/:id', HomeMiddleware.isCorrect,DeliveryController.deleteDelivery); // Delete program
Router.get('/:id', DeliveryController.viewDeliveryId); // View program by ID


module.exports = Router;
