const { About } = require('../db/models');
const { CommonLib } = require('../../../lib');
const { NotFoundError } = require('../../../errors/http/http.errors');

const AboutService = {
    // CREATE ABOUT
    async createAbout(data) {
        const existingAbout = await About.findOne({
            about_title: { $regex: new RegExp(`^${data.about_title}$`, 'i') },
            is_deleted: false,
        });

        if (existingAbout) {
            throw new Error('An about section with this title already exists.');
        }

        const newAbout = new About(data);
        return newAbout.save();
    },

    // GET ALL ABOUT RECORDS
    async getAllAbout({ page, limit, title, active, sortBy }) {
        const query = { is_deleted: false };
        if (title) query.about_title = { $regex: new RegExp(title, 'i') };
        if (active) query.is_active = active === 'true';

        const sortOptions = {
            '1': { title: 1 },
            '2': { title: -1 },
            '3': { createdAt: 1 },
            '4': { createdAt: -1 },
        };

        const sort = sortOptions[sortBy] || { createdAt: -1 };

        const total = await About.countDocuments(query);

        let items;
        if (page && limit) {
            const offset = (page - 1) * limit;
            items = await About.find(query).sort(sort).skip(offset).limit(Number(limit));
        } else {
            items = await About.find(query).sort(sort);
        }

        const pagination = CommonLib.getPagination(page, limit, total);
        return {
            items,
            pagination: page && limit ? pagination : null,
        };
    },

    // GET SINGLE ABOUT
    async getSingleAbout(id) {
        const about = await About.findById(id);
        if (!about || about.is_deleted) {
            throw new NotFoundError('About section not found');
        }
        return about;
    },

    // UPDATE ABOUT
    async updateAbout(id, data) {
        const existingAbout = await About.findOne({
            about_title: { $regex: new RegExp(`^${data.about_title}$`, 'i') },
            is_deleted: false,
            _id: { $ne: id },
        });

        if (existingAbout) {
            throw new Error('An about section with this title already exists.');
        }

        const about = await About.findByIdAndUpdate(id, data, { new: true });
        if (!about) {
            throw new NotFoundError('About section not found');
        }

        return about;
    },

    // DELETE ABOUT
    async deleteAbout(id) {
        const about = await About.findById(id);
        if (!about) {
            throw new NotFoundError('About section not found');
        }

        await About.findByIdAndRemove(id);
        return { message: 'About deleted permanently', about };
    },

    // TOGGLE STATUS
    async toggleStatus(id) {
        const about = await About.findById(id);
        console.log("toggle-status-------------");
        if (!about || about.is_deleted) {
            throw new NotFoundError('About section not found');
        }

        about.is_active = !about.is_active;
        return about.save();
    },
};

module.exports = AboutService;
