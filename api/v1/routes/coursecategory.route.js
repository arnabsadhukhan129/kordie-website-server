const Router = require('express').Router();
const {HomeMiddleware} = require('../middlewares');
const CourseCategoryController = require('../controllers/courseCategory.controller');

Router.post('/create',HomeMiddleware.isCorrect,CourseCategoryController.createCategory);
Router.get('/get-all',CourseCategoryController.getAllCategory);
Router.get('/get-all-with-product-count',CourseCategoryController.getCategoryWithProductCount);
Router.get('/get-single/:id',CourseCategoryController.getSingleCategory);
Router.delete('/delete/:id',HomeMiddleware.isCorrect,CourseCategoryController.deleteCategory);
Router.put('/update/:id',HomeMiddleware.isCorrect,CourseCategoryController.updateCategory);
Router.put('/:id/toggle-status',HomeMiddleware.isCorrect,CourseCategoryController.toggleStatus);
Router.get('/get-by-slug/:slug',CourseCategoryController.getBySlug);

module.exports = Router;