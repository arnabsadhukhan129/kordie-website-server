// ---------------------NOW USING INSIDE PRODUCT PAGE________________________________________


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { WhyTakeCourseService } = require('../services');

const WhyTakeCourseController = {
    create: [
        upload.fields([{ name: 'image', maxCount: 1 }]),
        async (req, res, next) => {
            try {
                const image = req.files?.image?.[0];
                const result = await WhyTakeCourseService.create(req.body, image);
                next({ message: 'Course created successfully', result });
            } catch (error) {
                next(error);
            }
        },
    ],

    getAll: async (req, res, next) => {
        try {
            const { page, limit, title, active, sortBy } = req.query;
            const result = await WhyTakeCourseService.getAll({ page, limit, title, active, sortBy });
            next(result);
        } catch (error) {
            next(error);
        }
    },

    getSingle: async (req, res, next) => {
        try {
            const result = await WhyTakeCourseService.getSingle(req.params.id);
            next(result);
        } catch (error) {
            next(error);
        }
    },

    update: [
        upload.fields([{ name: 'image', maxCount: 1 }]),
        async (req, res, next) => {
            try {
                const image = req.files?.image?.[0];
                const result = await WhyTakeCourseService.update(req.params.id, req.body, image);
                next({ message: 'Course updated successfully', result });
            } catch (error) {
                next(error);
            }
        },
    ],

    delete: async (req, res, next) => {
        try {
            const result = await WhyTakeCourseService.delete(req.params.id);
            next({ message: 'Course deleted successfully', result });
        } catch (error) {
            next(error);
        }
    },

    toggleStatus: async (req, res, next) => {
        try {
            const result = await WhyTakeCourseService.toggleStatus(req.params.id);
            next({ message: 'Status toggled successfully', result });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = WhyTakeCourseController;
