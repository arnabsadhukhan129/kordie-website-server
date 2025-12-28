const { GoalService } = require('../services');

const GoalController = {
    // CREATE GOAL
    async createGoal(req, res, next) {
        try {
            const result = await GoalService.createGoal(req.body);
            next({ message: 'Goal created successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // GET ALL GOALS
    async getAllGoals(req, res, next) {
        try {
            const { page, limit, name, active, sortBy } = req.query;
            const result = await GoalService.getAllGoals({ page, limit, name, active, sortBy });
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // GET SINGLE GOAL
    async getSingleGoal(req, res, next) {
        try {
            const result = await GoalService.getSingleGoal(req.params.id);
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // UPDATE GOAL
    async updateGoal(req, res, next) {
        try {
            const result = await GoalService.updateGoal(req.params.id, req.body);
            next({ message: 'Goal updated successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // DELETE GOAL
    async deleteGoal(req, res, next) {
        try {
            const result = await GoalService.deleteGoal(req.params.id);
            next({ message: 'Goal deleted successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // TOGGLE STATUS
    async toggleStatus(req, res, next) {
        try {
            const result = await GoalService.toggleStatus(req.params.id);
            next({ message: 'Status toggled successfully', result });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = GoalController;
