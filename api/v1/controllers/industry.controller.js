const { IndustryService } = require('../services');

const IndustryController = {
    // CREATE INDUSTRY
    async createIndustry(req, res, next) {
        try {
            const result = await IndustryService.createIndustry(req.body);
            next({ message: 'Industry created successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // GET ALL INDUSTRY
    async getAllIndustry(req, res, next) {
        try {
            const { page, limit, name, active, sortBy } = req.query;
            const result = await IndustryService.getAllIndustry({ page, limit, name, active, sortBy });
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // GET SINGLE INDUSTRY
    async getSingleIndustry(req, res, next) {
        try {
            const result = await IndustryService.getSingleIndustry(req.params.id);
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // UPDATE INDUSTRY
    async updateIndustry(req, res, next) {
        try {
            const result = await IndustryService.updateIndustry(req.params.id, req.body);
            next({ message: 'Industry updated successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // DELETE INDUSTRY
    async deleteIndustry(req, res, next) {
        try {
            const result = await IndustryService.deleteIndustry(req.params.id);
            next({ message: 'Industry deleted successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // TOGGLE STATUS
    async toggleStatus(req, res, next) {
        try {
            const result = await IndustryService.toggleStatus(req.params.id);
            next({ message: 'Status toggled successfully', result });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = IndustryController;
