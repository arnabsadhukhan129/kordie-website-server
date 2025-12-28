const Router = require('express').Router();
const {HomeMiddleware} = require('../middlewares');
const BlogController = require('../controllers/blog.controller');

Router.post('/create',HomeMiddleware.isCorrect,BlogController.createBlog);
Router.get('/get-all',BlogController.getAllBlog);
Router.get('/get-single/:id',BlogController.getSingleBlog);
Router.delete('/delete/:id',HomeMiddleware.isCorrect,BlogController.deleteBlog);
Router.put('/update/:id',HomeMiddleware.isCorrect,BlogController.updateBlog);
Router.put('/:id/toggle-status',HomeMiddleware.isCorrect,BlogController.toggleStatus);
Router.put('/:id/toggle-feature',HomeMiddleware.isCorrect,BlogController.toggleFeature);
Router.get('/featured-per-category', BlogController.getTwoFeaturedBlogsPerCategory);
Router.get('/get-by-slug/:slug',BlogController.getBySlug);
module.exports = Router;