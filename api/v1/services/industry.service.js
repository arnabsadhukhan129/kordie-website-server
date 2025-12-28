const { NotFoundError } = require('../../../errors/http/http.errors');
const { Industry,Product } = require('../db/models');
const { CommonLib } = require('../../../lib');

const IndustryService = {
    // CREATE GOAL
    async createIndustry(data) {
        const existingIndustry = await Industry.findOne({
            name: { $regex: new RegExp(`^${data.name}$`, 'i') }, // Case-insensitive regex match
            is_deleted: false
        });;
        if (existingIndustry) {
            throw new Error('A industry with this name already exists.');
        }

        const newIndustry = new Industry({
            name: data.name.trim(),
        });

        return newIndustry.save();
    },

    // GET ALL GOALS
    async getAllIndustry({ page, limit, name, active, sortBy }) {
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

        const total = await Industry.countDocuments(query);

        let items;
        if (page && limit) {
            const offset = (page - 1) * limit;
            items = await Industry.find(query).sort(sort).skip(offset).limit(Number(limit));
        } else {
            items = await Industry.find(query).sort(sort);
        }
        const pagination = CommonLib.getPagination(page, limit, total);
        return {
            items,
            pagination: page && limit ? pagination : null,
        };
    },

    // GET SINGLE GOAL
    async getSingleIndustry(id) {
        const industry = await Industry.findById(id);
        if (!industry || industry.is_deleted) {
            throw new NotFoundError('Industry not found');
        }
        return industry;
    },

    // UPDATE GOAL
    async updateIndustry(id, data) {
        const existingIndustry = await Industry.findOne({ name: { $regex: new RegExp(`^${data.name}$`, 'i') }, is_deleted: false, _id: { $ne: id } });
        if (existingIndustry) {
            throw new Error('A industry with this name already exists.');
        }

        const industry = await Industry.findByIdAndUpdate(
            id,
            { name: data.name.trim() },
            { new: true }
        );

        if (!industry) {
            throw new NotFoundError('Industry not found');
        }

        return industry;
    },

    // DELETE GOAL - Hard Delete
    async deleteIndustry(id) {
        const industry = await Industry.findById(id);

        if (!industry) {
            throw new NotFoundError('Industry not found');
        }

        // Check if the 'Industry' entry is assigned to any product
        const productUsingIndustry = await Product.findOne({ course_industry: id , is_deleted:false});
        if (productUsingIndustry) {
            throw new Error(
                `Industry cannot be deleted. It is assigned to the product. Please unassign the 'Industry' entry first.`
            );
        }

        // Permanently delete the document from the database
        await Industry.findByIdAndRemove(id);

        return { message: 'Industry deleted permanently', industry };
    },

    // TOGGLE STATUS
    async toggleStatus(id) {
        const industry = await Industry.findById(id);
        if (!industry || industry.is_deleted) {
            throw new NotFoundError('Industry not found');
        }

        industry.is_active = !industry.is_active;
        return industry.save();
    },
};

module.exports = IndustryService;
