const { NotFoundError } = require('../../../errors/http/http.errors');
const { Testimonial } = require('../db/models');
const s3Service = require('./s3.service'); 
const { CommonLib } = require('../../../lib');
const TestimonialService = {
    async createTestimonial(data, file) {
        const itemData = {
            name: data.name,
            designation: data.designation,
            feedback: data.feedback
        };

        if (file) {
            const imageUrl = await s3Service.uploadFile(file, 'images');
            itemData.image = imageUrl;
        }

        try {
            const newItem = await Testimonial.create(itemData);
            return { message: 'Testimonial item created successfully', data: newItem };
        } catch (error) {
            return { message: 'Error creating Testimonial item', data: error };
        }
    },

    async updateTestimonial(itemId, updatedDetails, file) {
        const itemData = {
            name: updatedDetails.name,
            designation: updatedDetails.designation,
            feedback: updatedDetails.feedback
        };

        if (file) {
            const imageUrl = await s3Service.uploadFile(file, 'images');
            itemData.image = imageUrl;
        }

        const updatedItem = await Testimonial.findByIdAndUpdate(itemId, itemData, { new: true });
        if (!updatedItem) {
            throw new Error('Testimonial item not found.');
        }

        return updatedItem;
    },

    async getTestimonial({ page, limit, name, active, sortBy }) {
        const aggregate = { is_deleted: false };
        let items = [];
        let offset;
        let total = null;
        let pagination = null;
        let sort = {};

        switch (sortBy) {
            case '1':
                sort = { name: 1 };
                break;
            case '2':
                sort = { name: -1 };
                break;
            case '3':
                sort = { createdAt: 1 };
                break;
            case '4':
                sort = { createdAt: -1 };
                break;
            default:
                sort = { createdAt: 1 };
        }

        if (page && limit) {
            offset = (page - 1) * limit;
            if (name) {
                aggregate.name = { $regex: new RegExp(name, 'i') };
            }
            if (active) {
                aggregate.is_active = active;
            }

            total = await Testimonial.countDocuments(aggregate);
            pagination = CommonLib.getPagination(page, limit, total);

            items = await Testimonial.find(aggregate)
                .sort(sort)
                .skip(offset)
                .limit(limit);
        } else {
            if (name) {
                aggregate.name = { $regex: new RegExp(name, 'i') };
            }
            if (active) {
                aggregate.is_active = active;
            }

            items = await Testimonial.find(aggregate).sort(sort);
            total = items.length;
        }

        return { items, pagination };
    },

    async getTestimonialById(itemId) {
        const item = await Testimonial.findById(itemId);
        if (!item) {
            throw new NotFoundError('Testimonial item not found.');
        }
        return item;
    },

    async deleteTestimonial(itemId) {
        const item = await Testimonial.findById(itemId);
        if (!item) {
            throw new NotFoundError('Testimonial item not found.');
        }
        // item.is_deleted = true;
        // await item.save();
        await Testimonial.findByIdAndDelete(itemId);
        return { message: 'Testimonial item deleted successfully', data: item };
    },

    async toggleStatus(toggleId) {
        const item = await Testimonial.findById(toggleId);
        if (!item) {
            throw new NotFoundError('Testimonial item not found.');
        }
        item.is_active = !item.is_active;
        await item.save();
        return { message: 'Status toggled successfully', data: item };
    },
};

module.exports = TestimonialService;
