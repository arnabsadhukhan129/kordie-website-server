const homePageController = require('../controllers/homePage.controller');
const Router = require('express').Router();
const {HomeMiddleware} = require('../middlewares');
Router.post('/create-meetyourcurators', HomeMiddleware.isCorrect, homePageController.createMeetCuatorsContent);
Router.get('/list-meetyourcurators', homePageController.getAllMeetCuatorsContent);
Router.put('/edit-meetyourcurators/:id', HomeMiddleware.isCorrect, homePageController.updateMeetCuatorsContent);
Router.delete('/delete-meetyourcurators/:id', HomeMiddleware.isCorrect, homePageController.deleteMeetCuatorsContent);
Router.get('/view-meetyourcurators/:id', homePageController.getMeetCuatorsContentById);

module.exports = Router;