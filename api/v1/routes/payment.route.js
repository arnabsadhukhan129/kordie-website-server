const express = require('express');
const PaymentController = require('../controllers/payment.controller');
const {HomeMiddleware} = require('../middlewares');
const router = express.Router();
//both membership checkout for only login or token based user not allowed for guest
router.post('/checkout', PaymentController.createCheckoutSession);
router.post('/checkout-user', PaymentController.createUserCheckoutSession);
router.post('/checkout-plan-guest', PaymentController.createGuestUserPlanCheckoutSession);

//for webhook handle
router.post('/webhook', express.raw({ type: 'application/json' }), PaymentController.handleWebhook);

router.get('/user-payment', PaymentController.getPayment);
//course checkout for guest user
router.post('/checkout-guest', PaymentController.createCourseCheckoutGuestSession);
//course checkout for login user
router.post('/checkout-course', HomeMiddleware.isCourseUserDiscount, PaymentController.createCourseCheckoutSession);
router.get('/admin-payment', HomeMiddleware.isCorrect, PaymentController.getAdminPayment);
module.exports = router;
