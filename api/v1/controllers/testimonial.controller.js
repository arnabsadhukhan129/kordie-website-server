const { TestimonialService } = require('../services');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const TestimonialController = {

    // CREATE A TRUSTED ITEM
    createTestimonial:[
    upload.fields([{ name: 'image', maxCount: 1 }]),
    async (req, res, next) => {
        try {
            let data = req.body;
            const imageFile = req.files?.image?.[0];
            const trustedItem = await TestimonialService.createTestimonial(data, imageFile);
            next(trustedItem);
        } catch (err) {
            next(err);
        }
    },
    ],

    // GET ALL TRUSTED ITEMS
    async getAllTestimonial(req, res, next) {
        try {
            const trustedItems = await TestimonialService.getTestimonial({
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 0,
                name: req.query.name,
                active: req.query.active,
                sortBy: req.query.sortBy,
            });
            next(trustedItems);
        } catch (err) {
            next(err);
        }
    },

    // DELETE A TRUSTED ITEM
    async deleteTestimonial(req, res, next) {
        try {
            const trustedItem = await TestimonialService.deleteTestimonial(req.params.id);
            next(trustedItem);
        } catch (err) {
            next(err);
        }
    },

    // UPDATE A TRUSTED ITEM
    updateTestimonial :[ 
    upload.fields([{ name: 'image', maxCount: 1 }]),
    async (req, res, next) => {
        try {
            const data = req.body;
            const imageFile = req.files?.image?.[0];
            const trustedItem = await TestimonialService.updateTestimonial(req.params.id, data, imageFile);
            next(trustedItem);
        } catch (err) {
            next(err);
        }
    },
    ],

    // GET SINGLE TRUSTED ITEM
    async getSingleTestimonial(req, res, next) {
        try {
            const { id } = req.params;
            const trustedItem = await TestimonialService.getTestimonialById(id);
            next(trustedItem);
        } catch (err) {
            next(err);
        }
    },

    // TOGGLE ACTIVE STATUS
    async toggleStatus(req, res, next) {
        try {
            const toggleId = req.params.id;
            const toggle = await TestimonialService.toggleStatus(toggleId);
            next(toggle);
        } catch (err) {
            next(err);
        }
    },
};

module.exports = TestimonialController;
