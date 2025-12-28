const { NotFoundError } = require('../../../errors/http/http.errors');
const { WeAreTrusted } = require('../db/models');
const s3Service = require('./s3.service'); 
const { CommonLib } = require('../../../lib');
const WeAreTrustedService = {
    async createWeAreTrusted(data, file) {
        const itemData = {
            title: data.title,
            description: data.description,
        };

        const existingItem = await WeAreTrusted.findOne({ title: itemData.title, is_deleted: false });
        if (existingItem) {
            throw new Error('Title already exists');
        }

        if (file) {
            const imageUrl = await s3Service.uploadFile(file, 'icons');
            itemData.icon = imageUrl;
        }

        try {
            const newItem = await WeAreTrusted.create(itemData);
            return { message: 'WeAreTrusted item created successfully', data: newItem };
        } catch (error) {
            return { message: 'Error creating WeAreTrusted item', data: error };
        }
    },

    async updateWeAreTrusted(itemId, updatedDetails, file) {
        const itemData = {
            title: updatedDetails.title,
            description: updatedDetails.description,
        };

        const existingItem = await WeAreTrusted.findOne({ title: itemData.title, _id: { $ne: itemId }, is_deleted: false });
        if (existingItem) {
            throw new Error('Title already exists');
        }

        if (file) {
            const imageUrl = await s3Service.uploadFile(file, 'icons');
            itemData.icon = imageUrl;
        }

        const updatedItem = await WeAreTrusted.findByIdAndUpdate(itemId, itemData, { new: true });
        if (!updatedItem) {
            throw new Error('WeAreTrusted item not found.');
        }

        return updatedItem;
    },

    async getWeAreTrusted({ page, limit, title, active, sortBy }) {
        const aggregate = { is_deleted: false };
        let items = [];
        let offset;
        let total = null;
        let pagination = null;
        let sort = {};

        switch (sortBy) {
            case '1':
                sort = { title: 1 };
                break;
            case '2':
                sort = { title: -1 };
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
            if (title) {
                aggregate.title = { $regex: new RegExp(title, 'i') };
            }
            if (active) {
                aggregate.is_active = active;
            }

            total = await WeAreTrusted.countDocuments(aggregate);
            // Calculate pagination
            pagination = CommonLib.getPagination(page, limit, total);
            

            items = await WeAreTrusted.find(aggregate)
                .sort(sort)
                .skip(offset)
                .limit(limit);
        } else {
            if (title) {
                aggregate.title = { $regex: new RegExp(title, 'i') };
            }
            if (active) {
                aggregate.is_active = active;
            }

            items = await WeAreTrusted.find(aggregate).sort(sort);
            total = items.length;
        }

        return { items, pagination };
    },

    async getWeAreTrustedById(itemId) {
        const item = await WeAreTrusted.findById(itemId);
        if (!item) {
            throw new NotFoundError('WeAreTrusted item not found.');
        }
        return item;
    },

    async deleteWeAreTrusted(itemId) {
        const item = await WeAreTrusted.findById(itemId);
        if (!item) {
            throw new NotFoundError('WeAreTrusted item not found.');
        }
        // item.is_deleted = true;
        // await item.save();
        await WeAreTrusted.findByIdAndDelete(itemId);
        return { message: 'WeAreTrusted item deleted successfully', data: item };
    },

    async toggleStatus(toggleId) {
        const item = await WeAreTrusted.findById(toggleId);
        if (!item) {
            throw new NotFoundError('WeAreTrusted item not found.');
        }
        item.is_active = !item.is_active;
        await item.save();
        return { message: 'Status toggled successfully', data: item };
    },
};

module.exports = WeAreTrustedService;
