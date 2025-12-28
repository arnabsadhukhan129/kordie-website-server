const { TaughtByService } = require('../services');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const TaughtByController = {
    // CREATE TAUGHT BY
    createTaughtBy:[
        upload.fields([{ name: 'image', maxCount: 1 }]),
    async (req, res, next) => {
        try {
            const image = req.files?.image?.[0];
            const result = await TaughtByService.createTaughtBy(req.body,image);
            next({ message: 'Taught by created successfully', result });
        } catch (error) {
            next(error);
        }
    },
    ],

    // GET ALL TAUGHT BY
    async getAllTaughtBy(req, res, next) {
        try {
            const { page, limit, name, active, sortBy } = req.query;
            const result = await TaughtByService.getAllTaughtBy({ page, limit, name, active, sortBy });
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // GET SINGLE TAUGHT BY
    async getSingleTaughtBy(req, res, next) {
        try {
            const result = await TaughtByService.getSingleTaughtBy(req.params.id);
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // UPDATE TAUGHT BY
    updateTaughtBy:[
        upload.fields([{ name: 'image', maxCount: 1 }]),
    async (req, res, next) => {
        try {
            const image = req.files?.image?.[0];
            const result = await TaughtByService.updateTaughtBy(req.params.id, req.body, image);
            next({ message: 'Taught by updated successfully', result });
        } catch (error) {
            next(error);
        }
    },
    ],

    // DELETE TAUGHT BY
    async deleteTaughtBy(req, res, next) {
        try {
            const result = await TaughtByService.deleteTaughtBy(req.params.id);
            next({ message: 'Taught by deleted successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // TOGGLE STATUS
    async toggleStatus(req, res, next) {
        try {
            const result = await TaughtByService.toggleStatus(req.params.id);
            next({ message: 'Status toggled successfully', result });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = TaughtByController;
