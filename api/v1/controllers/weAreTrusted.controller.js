const { WeAreTrustedService } = require('../services');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const WeAreTrustedController = {

    // CREATE A TRUSTED ITEM
    createWeAreTrusted:[
    upload.fields([{ name: 'icon', maxCount: 1 }]),
    async (req, res, next) => {
        try {
            let data = req.body;
            const iconFile = req.files?.icon?.[0];
            const trustedItem = await WeAreTrustedService.createWeAreTrusted(data, iconFile);
            next(trustedItem);
        } catch (err) {
            next(err);
        }
    },
    ],

    // GET ALL TRUSTED ITEMS
    async getAllWeAreTrusted(req, res, next) {
        try {
            const trustedItems = await WeAreTrustedService.getWeAreTrusted({
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 0,
                title: req.query.title,
                active: req.query.active,
                sortBy: req.query.sortBy,
            });
            next(trustedItems);
        } catch (err) {
            next(err);
        }
    },

    // DELETE A TRUSTED ITEM
    async deleteWeAreTrusted(req, res, next) {
        try {
            const trustedItem = await WeAreTrustedService.deleteWeAreTrusted(req.params.id);
            next(trustedItem);
        } catch (err) {
            next(err);
        }
    },

    // UPDATE A TRUSTED ITEM
    updateWeAreTrusted :[ 
    upload.fields([{ name: 'icon', maxCount: 1 }]),
    async (req, res, next) => {
        try {
            const data = req.body;
            const iconFile = req.files?.icon?.[0];
            const trustedItem = await WeAreTrustedService.updateWeAreTrusted(req.params.id, data, iconFile);
            next(trustedItem);
        } catch (err) {
            next(err);
        }
    },
    ],

    // GET SINGLE TRUSTED ITEM
    async getSingleWeAreTrusted(req, res, next) {
        try {
            const { id } = req.params;
            const trustedItem = await WeAreTrustedService.getWeAreTrustedById(id);
            next(trustedItem);
        } catch (err) {
            next(err);
        }
    },

    // TOGGLE ACTIVE STATUS
    async toggleStatus(req, res, next) {
        try {
            const toggleId = req.params.id;
            const toggle = await WeAreTrustedService.toggleStatus(toggleId);
            next(toggle);
        } catch (err) {
            next(err);
        }
    },
};

module.exports = WeAreTrustedController;
