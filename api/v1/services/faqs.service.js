const { NotFoundError } = require('../../../errors/http/http.errors');
const { Faqs } = require('../db/models');
const { CommonLib } = require('../../../lib');
const FaqsService = {
    // CREATE FAQ
    async createFaq(data) {
        const existingType = await Faqs.findOne({
            question: { $regex: new RegExp(data.question, 'i') }, // Case-insensitive regex match
            is_deleted: false
        });
        if (existingType) {
            throw new Error('Question already exists.');
        }
        const newFaq = new Faqs({
            question: data.question,
            answer: data.answer,
            faq_type: data.faq_type,
        });

        return newFaq.save();
    },

    // GET ALL FAQS
    async getAllFaqs({ page, limit, question, active, sortBy,faq_type }) {
        const query = { is_deleted: false };
        if (question) query.question = { $regex: new RegExp(question, 'i') };
        if (active) query.is_active = active === 'true';
        if (faq_type) {
            query.faq_type = faq_type;
        }

        const sortOptions = {
            '1': { question: 1 },
            '2': { question: -1 },
            '3': { createdAt: 1 },
            '4': { createdAt: -1 },
        };

        const sort = sortOptions[sortBy] || { createdAt: -1 };

        const total = await Faqs.countDocuments(query);

        let items;
        if (page && limit) {
            const offset = (page - 1) * limit;
            items = await Faqs.find(query).sort(sort).skip(offset).limit(Number(limit));
        } else {
            items = await Faqs.find(query).sort(sort);
        }
        pagination = CommonLib.getPagination(page, limit, total);
        return {
            items,
            pagination: page && limit ? pagination : null,
        };
    },

    // GET SINGLE FAQ
    async getSingleFaq(id) {
        const faq = await Faqs.findById(id);
        if (!faq || faq.is_deleted) {
            throw new NotFoundError('FAQ not found');
        }
        return faq;
    },

    // UPDATE FAQ
    async updateFaq(id, data) {

        const existingType = await Faqs.findOne({ question: { $regex: new RegExp(data.question, 'i') }, is_deleted: false, _id: { $ne: id } });
        if (existingType) {
            throw new Error('Question already exists.');
        }
        const faq = await Faqs.findByIdAndUpdate(
            id,
            { question: data.question, answer: data.answer, faq_type: data.faq_type },
            { new: true }
        );

        if (!faq) {
            throw new NotFoundError('FAQ not found');
        }

        return faq;
    },


    // DELETE FAQ - Hard Delete
    async deleteFaq(id) {
        const faq = await Faqs.findById(id);

        if (!faq) {
            throw new NotFoundError('FAQ not found');
        }

        // Permanently delete the document from the database
        await Faqs.findByIdAndRemove(id);

        return { message: 'FAQ deleted permanently', faq };
    },


    // TOGGLE STATUS
    async toggleStatus(id) {
        const faq = await Faqs.findById(id);
        if (!faq || faq.is_deleted) {
            throw new NotFoundError('FAQ not found');
        }

        faq.is_active = !faq.is_active;
        return faq.save();
    },
};

module.exports = FaqsService;
