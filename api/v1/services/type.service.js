const { NotFoundError } = require('../../../errors/http/http.errors');
const { Type,Product } = require('../db/models');
const { CommonLib } = require('../../../lib');

const TypeService = {
    // CREATE TYPE
    async createType(data) {
        const existingType = await Type.findOne({
            name: { $regex: new RegExp(`^${data.name}$`, 'i') }, // Case-insensitive regex match
            is_deleted: false
        });
        if (existingType) {
            throw new Error('A type with this name already exists.');
        }

        const newType = new Type({
            name: data.name.trim(),
            color: data.color
        });

        return newType.save();
    },

    // GET ALL TYPES
    async getAllTypes({ page, limit, name, active, sortBy }) {
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

        const total = await Type.countDocuments(query);

        let items;
        if (page && limit) {
            const offset = (page - 1) * limit;
            items = await Type.find(query).sort(sort).skip(offset).limit(Number(limit));
        } else {
            items = await Type.find(query).sort(sort);
        }
        const pagination = CommonLib.getPagination(page, limit, total);
        return {
            items,
            pagination: page && limit ? pagination : null,
        };
    },

    // GET SINGLE TYPE
    async getSingleType(id) {
        const type = await Type.findById(id);
        if (!type || type.is_deleted) {
            throw new NotFoundError('Type not found');
        }
        return type;
    },

    // UPDATE TYPE
    async updateType(id, data) {
        const existingType = await Type.findOne({ name: { $regex: new RegExp(`^${data.name}$`, 'i') }, is_deleted: false, _id: { $ne: id } });
        if (existingType) {
            throw new Error('A type with this name already exists.');
        }

        const type = await Type.findByIdAndUpdate(
            id,
            { name: data.name.trim(), color: data.color },
            { new: true }
        );

        if (!type) {
            throw new NotFoundError('Type not found');
        }

        return type;
    },

    // DELETE TYPE - Hard Delete
    async deleteType(id) {
        const type = await Type.findById(id);

        if (!type) {
            throw new NotFoundError('Type not found');
        }

        // Check if the 'Type' entry is assigned to any product
        const productUsingType = await Product.findOne({ course_type: id });
        if (productUsingType) {
            throw new Error(
                `Type cannot be deleted. It is assigned to the product. Please unassign the 'Type' entry first.`
            );
        }

        // Permanently delete the document from the database
        await Type.findByIdAndRemove(id);

        return { message: 'Type deleted permanently', type };
    },

    // TOGGLE STATUS
    async toggleStatus(id) {
        const type = await Type.findById(id);
        if (!type || type.is_deleted) {
            throw new NotFoundError('Type not found');
        }

        type.is_active = !type.is_active;
        return type.save();
    },
};

module.exports = TypeService;
