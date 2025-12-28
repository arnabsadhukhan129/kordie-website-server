const { NotFoundError } = require('../../../errors/http/http.errors');
const { Impact } = require('../db/models');
const { CommonLib } = require('../../../lib');

const ImpactService = {
    // CREATE IMPACT
    async createImpact(data) {
        const existingImpact = await Impact.findOne({
            impact_title: { $regex: new RegExp(`^${data.impact_title}$`, 'i') },
            is_deleted: false,
        });

        if (existingImpact) {
            throw new Error('An impact with this title already exists.');
        }

        const newImpact = new Impact(data);
        return newImpact.save();
    },

    // GET ALL IMPACTS
    async getAllImpacts({ page, limit, title, active, sortBy }) {
        const query = { is_deleted: false };
        if (title) query.impact_title = { $regex: new RegExp(title, 'i') };
        if (active) query.is_active = active === 'true';

        const sortOptions = {
            '1': { impact_title: 1 },
            '2': { impact_title: -1 },
            '3': { createdAt: 1 },
            '4': { createdAt: -1 },
        };

        const sort = sortOptions[sortBy] || { createdAt: -1 };

        const total = await Impact.countDocuments(query);

        let items;
        if (page && limit) {
            const offset = (page - 1) * limit;
            items = await Impact.find(query).sort(sort).skip(offset).limit(Number(limit));
        } else {
            items = await Impact.find(query).sort(sort);
        }

        const pagination = CommonLib.getPagination(page, limit, total);
        return {
            items,
            pagination: page && limit ? pagination : null,
        };
    },

    // GET SINGLE IMPACT
    async getSingleImpact(id) {
        const impact = await Impact.findById(id);
        if (!impact || impact.is_deleted) {
            throw new NotFoundError('Impact not found');
        }
        return impact;
    },

    // UPDATE IMPACT
    async updateImpact(id, data) {
        const existingImpact = await Impact.findOne({
            impact_title: { $regex: new RegExp(`^${data.impact_title}$`, 'i') },
            is_deleted: false,
            _id: { $ne: id },
        });

        if (existingImpact) {
            throw new Error('An impact with this title already exists.');
        }

        const impact = await Impact.findByIdAndUpdate(id, data, { new: true });
        if (!impact) {
            throw new NotFoundError('Impact not found');
        }

        return impact;
    },

    // DELETE IMPACT
    async deleteImpact(id) {
        const impact = await Impact.findById(id);
        if (!impact) {
            throw new NotFoundError('Impact not found');
        }

        await Impact.findByIdAndRemove(id);
        return { message: 'Impact deleted permanently', impact };
    },

    // TOGGLE STATUS
    async toggleStatus(id) {
        const impact = await Impact.findById(id);
        if (!impact || impact.is_deleted) {
            throw new NotFoundError('Impact not found');
        }

        impact.is_active = !impact.is_active;
        return impact.save();
    },
};

module.exports = ImpactService;
