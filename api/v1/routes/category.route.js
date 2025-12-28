const Router = require('express').Router();
const {HomeMiddleware} = require('../middlewares');
const CategoryController = require('../controllers/category.controller');

Router.post('/create',HomeMiddleware.isCorrect,CategoryController.createCategory);
Router.get('/get-all',CategoryController.getAllCategory);
Router.get('/get-single/:id',CategoryController.getSingleCategory);
Router.delete('/delete/:id',HomeMiddleware.isCorrect,CategoryController.deleteCategory);
Router.put('/update/:id',HomeMiddleware.isCorrect,CategoryController.updateCategory);
Router.put('/:id/toggle-status',HomeMiddleware.isCorrect,CategoryController.toggleStatus);
Router.get('/get-by-slug/:slug',CategoryController.getBySlug);
module.exports = Router;