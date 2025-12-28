const { InterestService } = require('../services');

const InterestController = {
    // CREATE INDUSTRY
    async createInterest(req, res, next) {
        try {
            const result = await InterestService.createInterest(req.body);
            next({ message: 'Interest created successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // GET ALL INDUSTRY
    async getAllInterest(req, res, next) {
        try {
            const { page, limit, name, active, sortBy } = req.query;
            const result = await InterestService.getAllInterest({ page, limit, name, active, sortBy });
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // GET SINGLE INDUSTRY
    async getSingleInterest(req, res, next) {
        try {
            const result = await InterestService.getSingleInterest(req.params.id);
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // UPDATE INDUSTRY
    async updateInterest(req, res, next) {
        try {
            const result = await InterestService.updateInterest(req.params.id, req.body);
            next({ message: 'Interest updated successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // DELETE INDUSTRY
    async deleteInterest(req, res, next) {
        try {
            const result = await InterestService.deleteInterest(req.params.id);
            next({ message: 'Interest deleted successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // TOGGLE STATUS
    async toggleStatus(req, res, next) {
        try {
            const result = await InterestService.toggleStatus(req.params.id);
            next({ message: 'Status toggled successfully', result });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = InterestController;
