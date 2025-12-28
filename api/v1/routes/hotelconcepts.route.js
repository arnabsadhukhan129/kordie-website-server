const express = require('express');
const hotelconseptscontroller = require('../controllers/hotelconsepts.controller');
const { HomeMiddleware } = require('../middlewares');
const exclusiveMiddleware = require('../middlewares/exclusive.middleware');

const router = express.Router();

router.post('/create', HomeMiddleware.isCorrect, hotelconseptscontroller.createEntry);
router.get('/get-all', hotelconseptscontroller.getAllHotelConcepts);
router.get('/get-single/:id', hotelconseptscontroller.getHotelConceptsById);
router.get('/get-by-slug/:slug', hotelconseptscontroller.getHotelConceptsBySlug);
router.put('/update/:id', HomeMiddleware.isCorrect, hotelconseptscontroller.updateHotelConcepts);
router.delete('/delete/:id', HomeMiddleware.isCorrect, hotelconseptscontroller.deleteHotelConcepts);


module.exports = router;