const { Whykordie } = require('../db/models');
const { CommonLib } = require('../../../lib');
const { NotFoundError } = require('../../../errors/http/http.errors');

const WhykordieService = {
    // CREATE WHYKORDIE
    async createWhykordie(data) {
        const existingWhykordie = await Whykordie.findOne({
            title: { $regex: new RegExp(`^${data.title}$`, 'i') },
            is_deleted: false,
        });

        if (existingWhykordie) {
            throw new Error('A Whykordie section with this title already exists.');
        }

        const newWhykordie = new Whykordie(data);
        return newWhykordie.save();
    },

    // GET ALL WHYKORDIE RECORDS
    async getAllWhykordie({ page, limit, title, active, sortBy }) {
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

        const total = await Whykordie.countDocuments(query);

        let items;
        if (page && limit) {
            const offset = (page - 1) * limit;
            items = await Whykordie.find(query).sort(sort).skip(offset).limit(Number(limit));
        } else {
            items = await Whykordie.find(query).sort(sort);
        }

        const pagination = CommonLib.getPagination(page, limit, total);
        return {
            items,
            pagination: page && limit ? pagination : null,
        };
    },

    // GET SINGLE WHYKORDIE
    async getSingleWhykordie(id) {
        const whykordie = await Whykordie.findById(id);
        if (!whykordie || whykordie.is_deleted) {
            throw new NotFoundError('Whykordie section not found');
        }
        return whykordie;
    },

    // UPDATE WHYKORDIE
    async updateWhykordie(id, data) {
        const existingWhykordie = await Whykordie.findOne({
            title: { $regex: new RegExp(`^${data.title}$`, 'i') },
            is_deleted: false,
            _id: { $ne: id },
        });

        if (existingWhykordie) {
            throw new Error('A Whykordie section with this title already exists.');
        }

        const whykordie = await Whykordie.findByIdAndUpdate(id, data, { new: true });
        if (!whykordie) {
            throw new NotFoundError('Whykordie section not found');
        }

        return whykordie;
    },

    // DELETE WHYKORDIE
    async deleteWhykordie(id) {
        const whykordie = await Whykordie.findById(id);
        if (!whykordie) {
            throw new NotFoundError('Whykordie section not found');
        }

        await Whykordie.findByIdAndRemove(id);
        return { message: 'Whykordie deleted permanently', whykordie };
    },

    // TOGGLE STATUS
    async toggleStatus(id) {
        const whykordie = await Whykordie.findById(id);
        if (!whykordie || whykordie.is_deleted) {
            throw new NotFoundError('Whykordie section not found');
        }

        whykordie.is_active = !whykordie.is_active;
        return whykordie.save();
    },
};

module.exports = WhykordieService;
