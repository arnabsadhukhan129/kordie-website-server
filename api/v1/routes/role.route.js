const express = require('express');
const { HomeMiddleware } = require('../middlewares');
const exclusiveMiddleware = require('../middlewares/exclusive.middleware');

const router = express.Router();

router.post('/create', HomeMiddleware.isCorrect, );
// router.get('/get-all', scentMarketingController.getAllScentMarketing);
// router.get('/get-single/:id', scentMarketingController.getScentMarketingById);
// router.get('/get-by-slug/:slug', scentMarketingController.getScentMarketingBySlug);
// router.put('/update/:id', HomeMiddleware.isCorrect, scentMarketingController.updateScentMarketing);
// router.delete('/delete/:id', HomeMiddleware.isCorrect, scentMarketingController.deleteScentMarketing);


module.exports = router;