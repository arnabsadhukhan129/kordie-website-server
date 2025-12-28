const UserController = require('../controllers/user.controller');
const Router = require('express').Router();
const { HomeMiddleware } = require('../middlewares');
const authorize = require('../middlewares/authorize.middleware');
Router.get('/', HomeMiddleware.isCorrect, UserController.listUser);
Router.get('/get-user/:id', HomeMiddleware.isCorrect, UserController.getUser);
Router.get('/get-plan', UserController.getPlan);
Router.post('/add-corporate', HomeMiddleware.isCorrect, UserController.addCorpUser);
Router.put('/get-user/:id', HomeMiddleware.isCorrect, UserController.getUserUpdate);


Router.get('/get-user-plan/:id', HomeMiddleware.isCorrect, UserController.getUserPlan);
Router.delete('/delete/:id',HomeMiddleware.isCorrect,UserController.deleteUser)
module.exports = Router;