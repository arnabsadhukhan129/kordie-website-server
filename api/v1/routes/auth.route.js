const Router = require('express').Router();
const AppConfig = require('../../../config/app.config');
const AuthController = require('../controllers/auth.controller');
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
const {RegisterMiddleware, ResetPasswordMiddleware, ChangePasswordMiddleware,HomeMiddleware} = require('../middlewares');
if(AppConfig.is_frontend_auth_enabled) {
    Router.post('/login', AuthController.login);
    
    if(AppConfig.is_registration_enabled) {
        Router.post('/register', [
            RegisterMiddleware.validateRegister, 
            RegisterMiddleware.checkUniqueIntigrity
        ], AuthController.register);
    }
}
const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  });
Router.post('/signup/step-one',  RegisterMiddleware.signUpOne, AuthController.signUpOne);
Router.post('/signup/step-two',  RegisterMiddleware.signUpTwo, AuthController.signUpTwo);
Router.post('/signup/step-three',  AuthController.signUpThree);
Router.post('/signup/step-four',  AuthController.signUpFour);
Router.post('/signup/step-five',  AuthController.signUpFive);
Router.post('/login-otp', AuthController.loginotp);
Router.post('/verify-otp', AuthController.verifyOtp);
Router.post('/resend-otp', AuthController.resendOtp);
Router.post('/logout', AuthController.logout);
Router.post('/forget-password', 
    ResetPasswordMiddleware.enabledPasswordFlow, 
AuthController.forgetPassword);
Router.post('/reset-password', [
    ResetPasswordMiddleware.enabledPasswordFlow,
    ResetPasswordMiddleware.checkToken,
    ResetPasswordMiddleware.checkPassword
], AuthController.resetPassword);
Router.post('/social-login', checkJwt, AuthController.socialLogin);
// Profile
Router.get('/profile', AuthController.myProfile);
Router.put('/profile', AuthController.updateMyProfile);
Router.post('/change-password', [
    ChangePasswordMiddleware.validateChangePassword
], AuthController.changePassword);
// Admin
Router.post('/admin', AuthController.adminLogin);
Router.post('/admin-create', HomeMiddleware.isCorrect, AuthController.registerAdmin);
Router.get('/admin/dashboard', HomeMiddleware.isCorrect, AuthController.adminDashboard);


module.exports = Router;