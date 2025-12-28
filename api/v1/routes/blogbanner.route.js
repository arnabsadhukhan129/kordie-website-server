const express = require('express');
const BlogBannerController = require('../controllers/blogbanner.controller');
const Router = express.Router();
const { HomeMiddleware } = require('../middlewares');

Router.post('/create', HomeMiddleware.isCorrect, BlogBannerController.createBanner);
Router.get('/get-all', BlogBannerController.getAllBanners);
Router.get('/get-single/:id', BlogBannerController.getSingleBanner);
Router.put('/update/:id', HomeMiddleware.isCorrect, BlogBannerController.updateBanner);
Router.delete('/delete/:id', HomeMiddleware.isCorrect, BlogBannerController.deleteBanner);
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, BlogBannerController.toggleStatus);

module.exports = Router;
