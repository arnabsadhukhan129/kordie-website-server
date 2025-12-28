const { TimeService } = require('../services');

const TimeController = {
    // CREATE TIME
    async createTime(req, res, next) {
        try {
            const result = await TimeService.createTime(req.body);
            next({ message: 'Time created successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // GET ALL TIMES
    async getAllTimes(req, res, next) {
        try {
            const { page, limit, name, active, sortBy } = req.query;
            const result = await TimeService.getAllTimes({ page, limit, name, active, sortBy });
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // GET SINGLE TIME
    async getSingleTime(req, res, next) {
        try {
            const result = await TimeService.getSingleTime(req.params.id);
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // UPDATE TIME
    async updateTime(req, res, next) {
        try {
            const result = await TimeService.updateTime(req.params.id, req.body);
            next({ message: 'Time updated successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // DELETE TIME
    async deleteTime(req, res, next) {
        try {
            const result = await TimeService.deleteTime(req.params.id);
            next({ message: 'Time deleted successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // TOGGLE STATUS
    async toggleStatus(req, res, next) {
        try {
            const result = await TimeService.toggleStatus(req.params.id);
            next({ message: 'Status toggled successfully', result });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = TimeController;
