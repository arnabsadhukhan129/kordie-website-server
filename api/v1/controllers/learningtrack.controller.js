const { LearningTrackService } = require('../services');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const LearningTrackController = {
    createLearningTrack:[
    upload.fields([{ name: 'image', maxCount: 1 }]),
    async (req, res, next) => {
        try {
            const data = req.body;
            const imageFile = req.files?.image?.[0];
            const result = await LearningTrackService.createLearningTrack(data, imageFile);
            next(result);
        } catch (err) {
            next(err);
        }
    },
    ],

    async getAllLearningTracks(req, res, next) {
        try {
            const result = await LearningTrackService.getLearningTracks({
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 0,
                name: req.query.name,
                active: req.query.active,
                sortby: req.query.sortBy,
            });
            next(result);
        } catch (err) {
            next(err);
        }
    },

    async deleteLearningTrack(req, res, next) {
        try {
            const result = await LearningTrackService.deleteLearningTrack(req.params.id);
            next(result);
        } catch (err) {
            next(err);
        }
    },
    updateLearningTrack:[
    upload.fields([{ name: 'image', maxCount: 1 }]),
    async (req, res, next) => {
        try {
            const data = req.body;
            const imageFile = req.files?.image?.[0];
            const result = await LearningTrackService.updateLearningTrack(req.params.id, data, imageFile);
            next(result);
        } catch (err) {
            next(err);
        }
    },
    ],

    async getSingleLearningTrack(req, res, next) {
        try {
            const result = await LearningTrackService.getLearningTrackById(req.params.id);
            next(result);
        } catch (err) {
            next(err);
        }
    },

    async toggleStatus(req, res, next) {
        try {
            const result = await LearningTrackService.toggleStatus(req.params.id);
            next(result);
        } catch (err) {
            next(err);
        }
    },
};

module.exports = LearningTrackController;
