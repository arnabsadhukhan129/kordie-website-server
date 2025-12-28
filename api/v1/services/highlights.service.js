const { NotFoundError } = require('../../../errors/http/http.errors');
const { CommonLib } = require('../../../lib');
const { Highlights } = require('../db/models');


const HighlightsService = {
    // CREATE HIGHLIGHT
    async createHighlight(data) {
        const newHighlight = new Highlights({
            title: data.title,
            description: data.description,
            url: data.url,
            tag: data.tag,
        });

        return newHighlight.save();
    },

    // GET ALL HIGHLIGHTS
    async getAllHighlights({ page, limit, title, active, sortBy }) {
        const query = { is_deleted: false };
        if (title) query.title = { $regex: new RegExp(title, 'i') };
        if (active) query.is_active = active === 'true';

        const sortOptions = {
            '1': { title: 1 },
            '2': { title: -1 },
            '3': { createdAt: 1 },
            '4': { createdAt: -1 },
        };

        const sort = sortOptions[sortBy] || { createdAt: -1 };

        const total = await Highlights.countDocuments(query);

        let items;
        if (page && limit) {
            const offset = (page - 1) * limit;
            items = await Highlights.find(query).sort(sort).skip(offset).limit(Number(limit));
        } else {
            items = await Highlights.find(query).sort(sort);
        }
        pagination = CommonLib.getPagination(page, limit, total);
        return {
            items,
            pagination: page && limit ? pagination : null,
        };
    },

    // GET SINGLE HIGHLIGHT
    async getSingleHighlight(id) {
        const highlight = await Highlights.findById(id);
        if (!highlight || highlight.is_deleted) {
            throw new NotFoundError('Highlight not found');
        }
        return highlight;
    },

    // UPDATE HIGHLIGHT
    async updateHighlight(id, data) {


        const highlight = await Highlights.findByIdAndUpdate(
            id,
            { title: data.title, description: data.description, url: data.url, tag: data.tag },
            { new: true }
        );

        if (!highlight) {
            throw new NotFoundError('Highlight not found');
        }

        return highlight;
    },

    // DELETE HIGHLIGHT
    async deleteHighlight(id) {
        const highlight = await Highlights.findById(id);
        if (!highlight || highlight.is_deleted) {
            throw new NotFoundError('Highlight not found');
        }
        await Highlights.findByIdAndDelete(id);
        return { message: 'Learning Track deleted successfully', highlight };
        // highlight.is_deleted = true;
        // return highlight.save();
    },

    // TOGGLE STATUS
    async toggleStatus(id) {
        const highlight = await Highlights.findById(id);
        if (!highlight || highlight.is_deleted) {
            throw new NotFoundError('Highlight not found');
        }

        highlight.is_active = !highlight.is_active;
        return highlight.save();
    },
};

module.exports = HighlightsService;
