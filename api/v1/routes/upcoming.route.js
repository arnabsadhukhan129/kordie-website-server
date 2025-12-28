const express = require('express');
const { HomeMiddleware } = require('../middlewares');
const exclusiveMiddleware = require('../middlewares/exclusive.middleware');
const upcomingController = require('../controllers/upcoming.controller');

const router = express.Router();

router.post('/create', HomeMiddleware.isCorrect, upcomingController.createEntry);
router.get('/get-all', upcomingController.getAll);
router.get('/get-single/:id', upcomingController.getUpcomingById);
// router.get('/get-by-slug/:slug', sustainabilityController.getSustainabilityByslug);
router.put('/update/:id', HomeMiddleware.isCorrect, upcomingController.update);
router.delete('/delete/:id', HomeMiddleware.isCorrect, upcomingController.delete);


module.exports = router;