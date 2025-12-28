const Router = require('express').Router();
const HospitalityController = require('../controllers/hospitality.controller');
const {HomeMiddleware} = require('../middlewares');
// Routes for the hospitality endpoints
Router.post('/create',HomeMiddleware.isCorrect, HospitalityController.createHospitality); // Create new hospitality
Router.get('/', HospitalityController.viewHospitality); // View hospitality by ID
Router.put('/:id', HomeMiddleware.isCorrect,HospitalityController.editHospitality); // Edit hospitality
Router.delete('/:id',HomeMiddleware.isCorrect, HospitalityController.deleteHospitality); // Delete hospitality
Router.get('/list', HospitalityController.listHospitality); // View hospitality by ID
Router.get('/:id', HospitalityController.viewHospitalityId); // View hospitality by ID
module.exports = Router;