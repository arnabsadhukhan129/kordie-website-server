const { NotFoundError } = require('../../../errors/http/http.errors');
const { CommonLib } = require('../../../lib');
const { LearningTrack } = require('../db/models');
const s3Service = require('./s3.service'); 
const LearningTrackService = {
    async createLearningTrack(data, file) {
        const trackData = {
            name: data.name,
            description: data.description,
            link: data.link
        };

        const existingTrack = await LearningTrack.findOne({ name: trackData.name, is_deleted: false });
        if (existingTrack) {
            throw new Error('Name already exists');
        }

        if (file) {
            const imageUrl = await s3Service.uploadFile(file, 'images');
            trackData.image = imageUrl;
        }

        try {
            const newTrack = await LearningTrack.create(trackData);
            return { message: 'Learning Track created successfully', data: newTrack };
        } catch (error) {
            return { message: 'Error creating Learning Track', data: error };
        }
    },

    async updateLearningTrack(trackId, updatedDetails, file) {
        const trackData = {
            name: updatedDetails.name,
            description: updatedDetails.description,
            link: updatedDetails.link
        };

        const existingTrack = await LearningTrack.findOne({ name: trackData.name, _id: { $ne: trackId }, is_deleted: false });
        if (existingTrack) {
            throw new Error('Name already exists');
        }

        if (file) {
            const imageUrl = await s3Service.uploadFile(file, 'images');
            trackData.image = imageUrl;
        }

        const updatedTrack = await LearningTrack.findByIdAndUpdate(trackId, trackData, { new: true });
        if (!updatedTrack) {
            throw new Error('Learning Track not found.');
        }

        return updatedTrack;
    },

    async getLearningTracks({ page, limit, name, active, sortby }) {
        const query = { is_deleted: false };
        if (name) query.name = { $regex: new RegExp(name, 'i') };
        if (active) query.is_active = active;

        const sort = {
            '1': { name: 1 },
            '2': { name: -1 },
            '3': { createdAt: 1 },
            '4': { createdAt: -1 },
        }[sortby] || { createdAt: 1 };

        if (page && limit) {
            const offset = CommonLib.getOffset(page, limit);
            const total = await LearningTrack.countDocuments(query);
            const pagination = CommonLib.getPagination(page, limit, total);

            const tracks = await LearningTrack.find(query).sort(sort).skip(offset).limit(limit);
            return { tracks, pagination };
        } else {
            const total = await LearningTrack.countDocuments(query);
            const tracks = await LearningTrack.find(query).sort(sort);
            return { tracks, total };
        }
    },

    async getLearningTrackById(trackId) {
        const track = await LearningTrack.findById(trackId);
        if (!track) throw new NotFoundError('Learning Track not found.');
        return track;
    },

    async deleteLearningTrack(trackId) {
        const track = await LearningTrack.findById(trackId);
        if (!track) throw new NotFoundError('Learning Track not found.');
        track.is_deleted = true;
        await track.save();
        await LearningTrack.findByIdAndDelete(trackId);
        return { message: 'Learning Track deleted successfully', track };
    },

    async toggleStatus(trackId) {
        const track = await LearningTrack.findById(trackId);
        if (!track) throw new NotFoundError('Learning Track not found.');
        track.is_active = !track.is_active;
        await track.save();
        return { message: 'Status toggled successfully', track };
    },
};

module.exports = LearningTrackService;
