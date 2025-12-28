const { NotFoundError,BadRequestError } = require('../../../errors/http/http.errors');
const { Topic,Product } = require('../db/models');
const { CommonLib } = require('../../../lib');

const TopicService = {
    // CREATE TOPIC
    async createTopic(data) {
        const existingTopic = await Topic.findOne({
            name: { $regex: new RegExp(`^${data.name}$`, 'i') }, // Case-insensitive regex match
            is_deleted: false
        });
        if (existingTopic) {
            throw new Error('A topic with this name already exists.');
        }

        const newTopic = new Topic({
            name: data.name.trim(),
            icon: data.icon
        });

        return newTopic.save();
    },

    // GET ALL TOPICS
    async getAllTopics({ page, limit, name, active, sortBy }) {
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

        const total = await Topic.countDocuments(query);

        let items;
        if (page && limit) {
            const offset = (page - 1) * limit;
            items = await Topic.find(query).sort(sort).skip(offset).limit(Number(limit));
        } else {
            items = await Topic.find(query).sort(sort);
        }
        const pagination = CommonLib.getPagination(page, limit, total);
        return {
            items,
            pagination: page && limit ? pagination : null,
        };
    },

    // GET SINGLE TOPIC
    async getSingleTopic(id) {
        const topic = await Topic.findById(id);
        if (!topic || topic.is_deleted) {
            throw new NotFoundError('Topic not found');
        }
        return topic;
    },

    // UPDATE TOPIC
    async updateTopic(id, data) {
        const existingTopic = await Topic.findOne({ name: { $regex: new RegExp(`^${data.name}$`, 'i') }, is_deleted: false, _id: { $ne: id } });
        if (existingTopic) {
            throw new Error('A topic with this name already exists.');
        }

        const topic = await Topic.findByIdAndUpdate(
            id,
            { name: data.name.trim(), icon: data.icon },
            { new: true }
        );

        if (!topic) {
            throw new NotFoundError('Topic not found');
        }

        return topic;
    },

    // DELETE TOPIC - Hard Delete
    async deleteTopic(id) {
        const topic = await Topic.findById(id);

        if (!topic) {
            throw new NotFoundError('Topic not found');
        }

         // Check if the topic is assigned to any product
         const productUsingTopic = await Product.findOne({ course_topic: id, is_deleted:false });

         if (productUsingTopic) {
            throw new Error(`Topic cannot be deleted. It is assigned to the product. Please unassign the topic first.`)
         }
 
         // Permanently delete the topic from the database
         await Topic.findByIdAndRemove(id);

        // Permanently delete the document from the database
        await Topic.findByIdAndRemove(id);

        return { message: 'Topic deleted permanently', topic };
    },

    // TOGGLE STATUS
    async toggleStatus(id) {
        const topic = await Topic.findById(id);
        if (!topic || topic.is_deleted) {
            throw new NotFoundError('Topic not found');
        }

        topic.is_active = !topic.is_active;
        return topic.save();
    },
};

module.exports = TopicService;
