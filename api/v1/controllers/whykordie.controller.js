const { WhykordieService } = require('../services');

const WhykordieController = {
    // CREATE WHYKORDIE
    async createWhykordie(req, res, next) {
        try {
            const data = {
                why_title: req.body.why_title,
                why_description: req.body.why_description,
                why_banner: req.body.why_banner,
                learning_title: req.body.learning_title,
                learning_description: req.body.learning_description,
                learning_section: req.body.learning_section,
                kordie_title: req.body.kordie_title,
                kordie_section: req.body.kordie_section,
                kordie_image: req.body.kordie_image,
                kordie_stand_title: req.body.kordie_stand_title,
                kordie_stand_section: req.body.kordie_stand_section,
                next_title: req.body.next_title,
                next_section: req.body.next_section,
                blog_title: req.body.blog_title
            };
            const result = await WhykordieService.createWhykordie(data);
            next({ message: 'Whykordie created successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // GET ALL WHYKORDIE RECORDS
    async getAllWhykordie(req, res, next) {
        try {
            const { page, limit, title, active, sortBy } = req.query;
            const result = await WhykordieService.getAllWhykordie({ page, limit, title, active, sortBy });
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // GET SINGLE WHYKORDIE
    async getSingleWhykordie(req, res, next) {
        try {
            const result = await WhykordieService.getSingleWhykordie(req.params.id);
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // UPDATE WHYKORDIE
    async updateWhykordie(req, res, next) {
        try {
            const data = {
                why_title: req.body.why_title,
                why_description: req.body.why_description,
                why_banner: req.body.why_banner,
                learning_title: req.body.learning_title,
                learning_description: req.body.learning_description,
                learning_section: req.body.learning_section,
                kordie_title: req.body.kordie_title,
                kordie_section: req.body.kordie_section,
                kordie_image: req.body.kordie_image,
                kordie_stand_title: req.body.kordie_stand_title,
                kordie_stand_section: req.body.kordie_stand_section,
                next_title: req.body.next_title,
                next_section: req.body.next_section,
                blog_title: req.body.blog_title
            };
            const result = await WhykordieService.updateWhykordie(req.params.id, data);
            next({ message: 'Whykordie updated successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // DELETE WHYKORDIE
    async deleteWhykordie(req, res, next) {
        try {
            const result = await WhykordieService.deleteWhykordie(req.params.id);
            next({ message: 'Whykordie deleted successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // TOGGLE STATUS
    async toggleStatus(req, res, next) {
        try {
            const result = await WhykordieService.toggleStatus(req.params.id);
            next({ message: 'Status toggled successfully', result });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = WhykordieController;
