const { TypeService } = require('../services');

const TypeController = {
    // CREATE TYPE
    async createType(req, res, next) {
        try {
            const result = await TypeService.createType(req.body);
            next({ message: 'Type created successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // GET ALL TYPES
    async getAllTypes(req, res, next) {
        try {
            const { page, limit, name, active, sortBy } = req.query;
            const result = await TypeService.getAllTypes({ page, limit, name, active, sortBy });
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // GET SINGLE TYPE
    async getSingleType(req, res, next) {
        try {
            const result = await TypeService.getSingleType(req.params.id);
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // UPDATE TYPE
    async updateType(req, res, next) {
        try {
            const result = await TypeService.updateType(req.params.id, req.body);
            next({ message: 'Type updated successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // DELETE TYPE
    async deleteType(req, res, next) {
        try {
            const result = await TypeService.deleteType(req.params.id);
            next({ message: 'Type deleted successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // TOGGLE STATUS
    async toggleStatus(req, res, next) {
        try {
            const result = await TypeService.toggleStatus(req.params.id);
            next({ message: 'Status toggled successfully', result });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = TypeController;
