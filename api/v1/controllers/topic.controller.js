const { TopicService } = require('../services');

const TopicController = {
    // CREATE TOPIC
    async createTopic(req, res, next) {
        try {
            const result = await TopicService.createTopic(req.body);
            next({ message: 'Topic created successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // GET ALL TOPICS
    async getAllTopics(req, res, next) {
        try {
            const { page, limit, name, active, sortBy } = req.query;
            const result = await TopicService.getAllTopics({ page, limit, name, active, sortBy });
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // GET SINGLE TOPIC
    async getSingleTopic(req, res, next) {
        try {
            const result = await TopicService.getSingleTopic(req.params.id);
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // UPDATE TOPIC
    async updateTopic(req, res, next) {
        try {
            const result = await TopicService.updateTopic(req.params.id, req.body);
            next({ message: 'Topic updated successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // DELETE TOPIC
    async deleteTopic(req, res, next) {
        try {
            const result = await TopicService.deleteTopic(req.params.id);
            next({ message: 'Topic deleted successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // TOGGLE STATUS
    async toggleStatus(req, res, next) {
        try {
            const result = await TopicService.toggleStatus(req.params.id);
            next({ message: 'Status toggled successfully', result });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = TopicController;
