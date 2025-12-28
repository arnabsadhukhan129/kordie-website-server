const express = require('express');
const WhyKordieController = require('../controllers/whykordie.controller');
const {HomeMiddleware} = require('../middlewares');
const router = express.Router();

// CREATE WHY KORDIE
router.post('/', HomeMiddleware.isCorrect, WhyKordieController.createWhykordie);

// GET ALL WHY KORDIE RECORDS
router.get('/', WhyKordieController.getAllWhykordie);

// GET SINGLE WHY KORDIE
router.get('/:id', WhyKordieController.getSingleWhykordie);

// UPDATE WHY KORDIE
router.put('/:id', HomeMiddleware.isCorrect, WhyKordieController.updateWhykordie);

// DELETE WHY KORDIE
router.delete('/:id', HomeMiddleware.isCorrect, WhyKordieController.deleteWhykordie);

// TOGGLE STATUS
router.put('/:id/toggle-status', HomeMiddleware.isCorrect, WhyKordieController.toggleStatus);

module.exports = router;
