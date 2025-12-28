const { BlogTypeService } = require('../services');

const BlogTypeController = {
    // CREATE TYPE
    async createType(req, res, next) {
        try {
            const result = await BlogTypeService.createType(req.body);
            next({ message: 'Type created successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // GET ALL TYPES
    async getAllTypes(req, res, next) {
        try {
            const { page, limit, name, active, sortBy } = req.query;
            const result = await BlogTypeService.getAllTypes({ page, limit, name, active, sortBy });
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // GET SINGLE TYPE
    async getSingleType(req, res, next) {
        try {
            const result = await BlogTypeService.getSingleType(req.params.id);
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // UPDATE TYPE
    async updateType(req, res, next) {
        try {
            const result = await BlogTypeService.updateType(req.params.id, req.body);
            next({ message: 'Type updated successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // DELETE TYPE
    async deleteType(req, res, next) {
        try {
            const result = await BlogTypeService.deleteType(req.params.id);
            next({ message: 'Type deleted successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // TOGGLE STATUS
    async toggleStatus(req, res, next) {
        try {
            const result = await BlogTypeService.toggleStatus(req.params.id);
            next({ message: 'Status toggled successfully', result });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = BlogTypeController;
