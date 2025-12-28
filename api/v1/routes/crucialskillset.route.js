const Router = require('express').Router();
const {HomeMiddleware} = require('../middlewares');
const CrucialSkillSetController = require('../controllers/crucialskillset.controller');

Router.post('/create', HomeMiddleware.isCorrect, CrucialSkillSetController.create);
Router.get('/get-all', CrucialSkillSetController.getAll);
Router.get('/get/:key', CrucialSkillSetController.getByKey);
Router.put('/update/:key', HomeMiddleware.isCorrect,CrucialSkillSetController.update);
Router.delete('/delete/:key', HomeMiddleware.isCorrect, CrucialSkillSetController.delete);
Router.put('/:key/toggle-status',HomeMiddleware.isCorrect, CrucialSkillSetController.toggleStatus);
Router.get('/get-title',CrucialSkillSetController.getAllTitlesAndKeys);
Router.get('/get-single/:id', CrucialSkillSetController.getById);

module.exports = Router;