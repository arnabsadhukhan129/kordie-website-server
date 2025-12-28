const express = require('express');
const ProductController = require('../controllers/product.controller');
const { HomeMiddleware } = require('../middlewares');
const ProductMiddleware = require('../middlewares/product.middleware');

const Router = express.Router();

// Create Product
Router.post('/create', HomeMiddleware.isCorrect, ProductMiddleware.removeRepeatedDataInSyllabus, ProductController.createProduct);

// Get All Products
Router.get('/get-all', ProductController.getAllProducts);

// Get Single Product by ID
Router.get('/get-single/:id', ProductController.getSingleProduct);

// Get Single Product by Slug
Router.get('/get-by-slug/:slug', HomeMiddleware.isCourseUserDiscount, ProductController.getBySlug);
Router.get('/slug-data/:slug', ProductController.getAnyProductBySlug);

// Update Product
Router.put('/update/:id', HomeMiddleware.isCorrect, ProductMiddleware.removeRepeatedDataInSyllabus, ProductController.updateProduct);

// Delete Product
Router.delete('/delete/:id', HomeMiddleware.isCorrect, ProductController.deleteProduct);

// Toggle Active Status
Router.put('/:id/toggle-status', HomeMiddleware.isCorrect, ProductController.toggleStatus);
Router.put('/:id/toggle-feature', HomeMiddleware.isCorrect, ProductController.toggleFeature);

// Route to add a recently viewed course
Router.post('/recently-viewed', ProductController.addRecentlyViewedCourse);

// Route to fetch recently viewed courses
Router.get('/recently-viewed', ProductController.getRecentlyViewedCourses);


Router.post('/manage-saved-course', ProductController.manageSavedCourse);

Router.get('/manage-saved-course', ProductController.getManageSavedCourse);


Router.post('/enrolled-course', HomeMiddleware.isCorrect, ProductController.enrolledCourse);

Router.get('/enrolled-course', ProductController.getEnrolledCourse);

Router.get('/user-enrolled-course/:id', HomeMiddleware.isCorrect, ProductController.getAdminEnrolledCourse);

//Router.get('/get-upcoming-course', ProductController.getUpcomingCourse);

module.exports = Router;
