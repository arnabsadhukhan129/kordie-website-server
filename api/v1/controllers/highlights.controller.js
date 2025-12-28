const { HighlightsService } = require('../services');
const HighlightsController = {
    // CREATE HIGHLIGHT
    async createHighlight(req, res, next) {
        try {
            const result = await HighlightsService.createHighlight(req.body);
            next({ message: 'Highlight created successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // GET ALL HIGHLIGHTS
    async getAllHighlights(req, res, next) {
        try {
            const { page, limit, title, active, sortBy } = req.query;
            const result = await HighlightsService.getAllHighlights({ page, limit, title, active, sortBy });
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // GET SINGLE HIGHLIGHT
    async getSingleHighlight(req, res, next) {
        try {
            const result = await HighlightsService.getSingleHighlight(req.params.id);
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // UPDATE HIGHLIGHT
    async updateHighlight(req, res, next) {
        try {
            const result = await HighlightsService.updateHighlight(req.params.id, req.body);
            next({ message: 'Highlight updated successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // DELETE HIGHLIGHT
    async deleteHighlight(req, res, next) {
        try {
            const result = await HighlightsService.deleteHighlight(req.params.id);
            next({ message: 'Highlight deleted successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // TOGGLE STATUS
    async toggleStatus(req, res, next) {
        try {
            const result = await HighlightsService.toggleStatus(req.params.id);
            next({ message: 'Status toggled successfully', result });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = HighlightsController;
