const { NotFoundError } = require('../../../errors/http/http.errors');
const { Goal,Product } = require('../db/models');
const { CommonLib } = require('../../../lib');

const GoalService = {
    // CREATE GOAL
    async createGoal(data) {
        const existingGoal = await Goal.findOne({
            name: { $regex: new RegExp(`^${data.name}$`, 'i') }, // Case-insensitive regex match
            is_deleted: false
        });;
        if (existingGoal) {
            throw new Error('A goal with this name already exists.');
        }

        const newGoal = new Goal({
            name: data.name.trim(),
        });

        return newGoal.save();
    },

    // GET ALL GOALS
    async getAllGoals({ page, limit, name, active, sortBy }) {
        const query = { is_deleted: false };
        if (name) query.name = { $regex: new RegExp(name, 'i') };
        if (active) query.is_active = active === 'true';

        const sortOptions = {
            '1': { name: 1 },
            '2': { name: -1 },
            '3': { createdAt: 1 },
            '4': { createdAt: -1 },
        };

        const sort = sortOptions[sortBy] || { createdAt: -1 };

        const total = await Goal.countDocuments(query);

        let items;
        if (page && limit) {
            const offset = (page - 1) * limit;
            items = await Goal.find(query).sort(sort).skip(offset).limit(Number(limit));
        } else {
            items = await Goal.find(query).sort(sort);
        }
        const pagination = CommonLib.getPagination(page, limit, total);
        return {
            items,
            pagination: page && limit ? pagination : null,
        };
    },

    // GET SINGLE GOAL
    async getSingleGoal(id) {
        const goal = await Goal.findById(id);
        if (!goal || goal.is_deleted) {
            throw new NotFoundError('Goal not found');
        }
        return goal;
    },

    // UPDATE GOAL
    async updateGoal(id, data) {
        const existingGoal = await Goal.findOne({ name: { $regex: new RegExp(`^${data.name}$`, 'i') }, is_deleted: false, _id: { $ne: id } });
        if (existingGoal) {
            throw new Error('A goal with this name already exists.');
        }

        const goal = await Goal.findByIdAndUpdate(
            id,
            { name: data.name.trim() },
            { new: true }
        );

        if (!goal) {
            throw new NotFoundError('Goal not found');
        }

        return goal;
    },

    // DELETE GOAL - Hard Delete
    async deleteGoal(id) {
        const goal = await Goal.findById(id);

        if (!goal) {
            throw new NotFoundError('Goal not found');
        }
            // Check if the goal is assigned to any product
        const productUsingGoal = await Product.findOne({ course_goal: id ,is_deleted:false});
        if (productUsingGoal) {
            throw new Error(
                `Goal cannot be deleted. It is assigned to the product. Please unassign the goal first.`
            );
        }
        // Permanently delete the document from the database
        await Goal.findByIdAndRemove(id);

        return { message: 'Goal deleted permanently', goal };
    },

    // TOGGLE STATUS
    async toggleStatus(id) {
        const goal = await Goal.findById(id);
        if (!goal || goal.is_deleted) {
            throw new NotFoundError('Goal not found');
        }

        goal.is_active = !goal.is_active;
        return goal.save();
    },
};

module.exports = GoalService;
