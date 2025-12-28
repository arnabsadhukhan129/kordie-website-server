const { FaqsService } = require('../services');

const FaqsController = {
    // CREATE FAQ
    async createFaq(req, res, next) {
        try {
            const result = await FaqsService.createFaq(req.body);
            next({ message: 'FAQ created successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // GET ALL FAQS
    async getAllFaqs(req, res, next) {
        try {
            const { page, limit, question, active, sortBy,faq_type } = req.query;
            const result = await FaqsService.getAllFaqs({ page, limit, question, active, sortBy,faq_type });
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // GET SINGLE FAQ
    async getSingleFaq(req, res, next) {
        try {
            const result = await FaqsService.getSingleFaq(req.params.id);
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // UPDATE FAQ
    async updateFaq(req, res, next) {
        try {
            const result = await FaqsService.updateFaq(req.params.id, req.body);
            next({ message: 'FAQ updated successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // DELETE FAQ
    async deleteFaq(req, res, next) {
        try {
            const result = await FaqsService.deleteFaq(req.params.id);
            next({ message: 'FAQ deleted successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // TOGGLE STATUS
    async toggleStatus(req, res, next) {
        try {
            const result = await FaqsService.toggleStatus(req.params.id);
            next({ message: 'Status toggled successfully', result });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = FaqsController;
