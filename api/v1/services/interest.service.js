const { NotFoundError } = require('../../../errors/http/http.errors');
const { Interest,Product } = require('../db/models');
const { CommonLib } = require('../../../lib');

const InterestService = {
    // CREATE INTEREST
    async createInterest(data) {
        const existingInterest = await Interest.findOne({
            name: { $regex: new RegExp(`^${data.name}$`, 'i') }, // Case-insensitive regex match
            is_deleted: false
        });;
        if (existingInterest) {
            throw new Error('A interest with this name already exists.');
        }

        const newInterest = new Interest({
            name: data.name.trim(),
        });

        return newInterest.save();
    },

    // GET ALL INTERESTS
    async getAllInterest({ page, limit, name, active, sortBy }) {
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

        const total = await Interest.countDocuments(query);

        let items;
        if (page && limit) {
            const offset = (page - 1) * limit;
            items = await Interest.find(query).sort(sort).skip(offset).limit(Number(limit));
        } else {
            items = await Interest.find(query).sort(sort);
        }
        const pagination = CommonLib.getPagination(page, limit, total);
        return {
            items,
            pagination: page && limit ? pagination : null,
        };
    },

    // GET SINGLE INTEREST
    async getSingleInterest(id) {
        const interest = await Interest.findById(id);
        if (!interest || interest.is_deleted) {
            throw new NotFoundError('Interest not found');
        }
        return interest;
    },

    // UPDATE INTEREST
    async updateInterest(id, data) {
        const existingInterest = await Interest.findOne({ name: { $regex: new RegExp(`^${data.name}$`, 'i') }, is_deleted: false, _id: { $ne: id } });
        if (existingInterest) {
            throw new Error('A interest with this name already exists.');
        }

        const interest = await Interest.findByIdAndUpdate(
            id,
            { name: data.name.trim() },
            { new: true }
        );

        if (!interest) {
            throw new NotFoundError('Interest not found');
        }

        return interest;
    },

    // DELETE INTEREST - Hard Delete
    async deleteInterest(id) {
        const interest = await Interest.findById(id);

        if (!interest) {
            throw new NotFoundError('Interest not found');
        }

        // Check if the 'Interest' entry is assigned to any product
        const productUsingInterest = await Product.findOne({ course_interest: id, is_deleted:false });
        if (productUsingInterest) {
            throw new Error(
                `Interest cannot be deleted. It is assigned to the product. Please unassign the 'Interest' entry first.`
            );
        }


        // Permanently delete the document from the database
        await Interest.findByIdAndRemove(id);

        return { message: 'Interest deleted permanently', interest };
    },

    // TOGGLE STATUS
    async toggleStatus(id) {
        const interest = await Interest.findById(id);
        if (!interest || interest.is_deleted) {
            throw new NotFoundError('Interest not found');
        }

        interest.is_active = !interest.is_active;
        return interest.save();
    },
};

module.exports = InterestService;
