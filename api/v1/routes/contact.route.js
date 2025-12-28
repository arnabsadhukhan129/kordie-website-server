const ContactController = require('../controllers/contact.controller');
const Router = require('express').Router();
const {HomeMiddleware} = require('../middlewares');

Router.post('/uploadcv',ContactController.uploadcv);
Router.post('/',HomeMiddleware.validateUpdate,ContactController.createContact);
Router.get('/types',ContactController.contactDropdown);
Router.get('/',HomeMiddleware.isCorrect,ContactController.getAllContact);
Router.get('/:id', ContactController.getCon);
Router.delete('/:id', HomeMiddleware.isCorrect, ContactController.deleteContact);





module.exports = Router;