const contentController = require('../controllers/content.controller');
const Router = require('express').Router();

Router.post('/create-content', contentController.createContent);
Router.put('/edit-content/:id', contentController.editContent);
Router.get('/content-url/:url',contentController.getContentByUrl);
Router.get('/get-single/:id',contentController.getSingleContent);
Router.put('/change-status/:id',contentController.toggleActiveStatus);
Router.get('/get-all',contentController.getAllContent);
Router.post('/upload', contentController.uploadMedia);
Router.delete('/delete', contentController.deleteMedia);
module.exports = Router;