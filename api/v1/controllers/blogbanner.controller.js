const { BlogBannerService } = require('../services');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const BlogBannerController = {
    createBanner: [
        upload.fields([{ name: 'image', maxCount: 1 }]),
        async (req, res, next) => {
            try {
                const image = req.files?.image?.[0];
                const result = await BlogBannerService.createBanner(req.body, image);
                next({ message: 'Blog banner created successfully', result });
            } catch (error) {
                next(error);
            }
        },
    ],

    async getAllBanners(req, res, next) {
        try {
            const { page, limit, title, active, sortBy } = req.query;
            const result = await BlogBannerService.getAllBanners({ page, limit, title, active, sortBy });
            next(result);
        } catch (error) {
            next(error);
        }
    },

    async getSingleBanner(req, res, next) {
        try {
            const result = await BlogBannerService.getSingleBanner(req.params.id);
            next(result);
        } catch (error) {
            next(error);
        }
    },

    updateBanner: [
        upload.fields([{ name: 'image', maxCount: 1 }]),
        async (req, res, next) => {
            try {
                const image = req.files?.image?.[0];
                const result = await BlogBannerService.updateBanner(req.params.id, req.body, image);
                next({ message: 'Blog banner updated successfully', result });
            } catch (error) {
                next(error);
            }
        },
    ],

    async deleteBanner(req, res, next) {
        try {
            const result = await BlogBannerService.deleteBanner(req.params.id);
            next({ message: 'Blog banner deleted successfully', result });
        } catch (error) {
            next(error);
        }
    },

    async toggleStatus(req, res, next) {
        try {
            const result = await BlogBannerService.toggleStatus(req.params.id);
            next({ message: 'Status toggled successfully', result });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = BlogBannerController;
