const express = require('express');
const sustainabilityController = require('../controllers/sustainability.controller');
const { HomeMiddleware } = require('../middlewares');
const exclusiveMiddleware = require('../middlewares/exclusive.middleware');

const router = express.Router();

router.post('/create', HomeMiddleware.isCorrect, sustainabilityController.createEntry);
router.get('/get-all', sustainabilityController.getAllSustainability);
router.get('/get-single/:id', sustainabilityController.getSustainabilityById);
router.get('/get-by-slug/:slug', sustainabilityController.getSustainabilityByslug);
router.put('/update/:id', HomeMiddleware.isCorrect, sustainabilityController.updateSustainability);
router.delete('/delete/:id', HomeMiddleware.isCorrect, sustainabilityController.deleteSustainability);


module.exports = router;