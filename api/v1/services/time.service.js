const { NotFoundError } = require('../../../errors/http/http.errors');
const { Time,Product } = require('../db/models');
const { CommonLib } = require('../../../lib');

const TimeService = {
    // CREATE TIME
    async createTime(data) {
        const existingTime = await Time.findOne({
            name: { $regex: new RegExp(`^${data.name}$`, 'i') }, // Case-insensitive regex match
            is_deleted: false
        });
        if (existingTime) {
            throw new Error('A time with this name already exists.');
        }

        const newTime = new Time({
            name: data.name.trim(),
        });

        return newTime.save();
    },

    // GET ALL TIMES
    async getAllTimes({ page, limit, name, active, sortBy }) {
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

        const total = await Time.countDocuments(query);

        let items;
        if (page && limit) {
            const offset = (page - 1) * limit;
            items = await Time.find(query).sort(sort).skip(offset).limit(Number(limit));
        } else {
            items = await Time.find(query).sort(sort);
        }
        const pagination = CommonLib.getPagination(page, limit, total);
        return {
            items,
            pagination: page && limit ? pagination : null,
        };
    },

    // GET SINGLE TIME
    async getSingleTime(id) {
        const time = await Time.findById(id);
        if (!time || time.is_deleted) {
            throw new NotFoundError('Time not found');
        }
        return time;
    },

    // UPDATE TIME
    async updateTime(id, data) {
        const existingTime = await Time.findOne({ name: { $regex: new RegExp(`^${data.name}$`, 'i') }, is_deleted: false, _id: { $ne: id } });
        if (existingTime) {
            throw new Error('A time with this name already exists.');
        }

        const time = await Time.findByIdAndUpdate(
            id,
            { name: data.name.trim()},
            { new: true }
        );

        if (!time) {
            throw new NotFoundError('Time not found');
        }

        return time;
    },

    // DELETE TIME - Hard Delete
    async deleteTime(id) {
        const time = await Time.findById(id);

        if (!time) {
            throw new NotFoundError('Time not found');
        }

        const productUsingTime = await Product.findOne({ course_time: id , is_deleted:false});

        if (productUsingTime) {
            throw new Error(`Time cannot be deleted. It is assigned to the product. Please unassign the time first.`);
        }

        // Permanently delete the document from the database
        await Time.findByIdAndRemove(id);

        return { message: 'Time deleted permanently', time };
    },

    // TOGGLE STATUS
    async toggleStatus(id) {
        const time = await Time.findById(id);
        if (!time || time.is_deleted) {
            throw new NotFoundError('Time not found');
        }

        time.is_active = !time.is_active;
        return time.save();
    },
};

module.exports = TimeService;
