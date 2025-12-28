const express = require('express');
const onlineReputationManagementController = require('../controllers/onlineReputationManagement.controller');
const { HomeMiddleware } = require('../middlewares');

const router = express.Router();

router.post('/create', HomeMiddleware.isCorrect, onlineReputationManagementController.createEntry);
router.get('/get-all', onlineReputationManagementController.getAllOnlineReputationManagements);
router.get('/get-single/:id', onlineReputationManagementController.getOnlineReputationManagementsById);
router.get('/get-by-slug/:slug', onlineReputationManagementController.getOnlineReputationManagementsBySlug);
router.put('/update/:id', HomeMiddleware.isCorrect, onlineReputationManagementController.updateOnlineReputationManagements);
router.delete('/delete/:id', HomeMiddleware.isCorrect, onlineReputationManagementController.deleteOnlineReputationManagements);


module.exports = router;