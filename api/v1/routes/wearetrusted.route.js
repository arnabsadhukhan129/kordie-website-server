const Router = require('express').Router();
const WeAreTrustedController = require('../controllers/weAreTrusted.controller');
const {HomeMiddleware} = require('../middlewares');
Router.post('/create', HomeMiddleware.isCorrect, WeAreTrustedController.createWeAreTrusted);
Router.get('/get-all', WeAreTrustedController.getAllWeAreTrusted);
Router.get('/get-single/:id', WeAreTrustedController.getSingleWeAreTrusted);
Router.delete('/delete/:id', HomeMiddleware.isCorrect, WeAreTrustedController.deleteWeAreTrusted);
Router.put('/update/:id', HomeMiddleware.isCorrect, WeAreTrustedController.updateWeAreTrusted);
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, WeAreTrustedController.toggleStatus);

module.exports = Router;
