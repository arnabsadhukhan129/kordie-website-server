const { AboutService } = require('../services');

const AboutController = {
    // CREATE ABOUT
    async createAbout(req, res, next) {
        try {
            const data = {
                about_title: req.body.about_title,
                about_description: req.body.about_description,
                about_banner: req.body.about_banner, // Array of objects [{ image: String }]

                see_title: req.body.see_title,
                see_description: req.body.see_description,
                see_media: req.body.see_media,
                see_type: req.body.see_type, // Must be 'video' or 'image'

                economic_title: req.body.economic_title,
                economic_section: req.body.economic_section, // Array of objects [{ title: String }]
                economic_icon: req.body.economic_icon,
                economic_description: req.body.economic_description,
                economic_image: req.body.economic_image,

                world_icon: req.body.world_icon,
                world_title: req.body.world_title,
                world_section: req.body.world_section, // Array of objects [{ title: String, description: String }]
                world_subsection: req.body.world_subsection, // Array of objects [{ title: String, subtitle: String }]

                learning_title: req.body.learning_title,
                learning_image: req.body.learning_image,
                learning_subtitle: req.body.learning_subtitle,
                learning_description: req.body.learning_description,
                learning_below_subtitle: req.body.learning_below_subtitle,
                learning_skill: req.body.learning_skill, // Array of objects [{ title: String }]

                kordie_title: req.body.kordie_title,
                kordie_description: req.body.kordie_description,
                kordie_image: req.body.kordie_image,
                kordie_job_subtitle: req.body.kordie_job_subtitle,
                kordie_job_section: req.body.kordie_job_section, // Array of objects [{ image, title, description }]
                kordie_industries_title: req.body.kordie_industries_title,
                kordie_industries_section: req.body.kordie_industries_section, // Array of objects [{ title: String }]

                story_title: req.body.story_title,
                story_section: req.body.story_section, // Array of objects [{ description, image }]

                live_title: req.body.live_title,
                live_section: req.body.live_section, // Array of objects [{ title, description }]
                live_image: req.body.live_image,

                next_title: req.body.next_title,
                next_section: req.body.next_section, // Array of objects [{ icon, image, title, description }]

            };
            const result = await AboutService.createAbout(data);
            next({ message: 'About created successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // GET ALL ABOUT RECORDS
    async getAllAbout(req, res, next) {
        try {
            const { page, limit, title, active, sortBy } = req.query;
            const result = await AboutService.getAllAbout({ page, limit, title, active, sortBy });
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // GET SINGLE ABOUT
    async getSingleAbout(req, res, next) {
        try {
            const result = await AboutService.getSingleAbout(req.params.id);
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // UPDATE ABOUT
    async updateAbout(req, res, next) {
        try {
            const data = {
                about_title: req.body.about_title,
                about_description: req.body.about_description,
                about_banner: req.body.about_banner, // Array of objects [{ image: String }]

                see_title: req.body.see_title,
                see_description: req.body.see_description,
                see_media: req.body.see_media,
                see_type: req.body.see_type, // Must be 'video' or 'image'

                economic_title: req.body.economic_title,
                economic_section: req.body.economic_section, // Array of objects [{ title: String }]
                economic_icon: req.body.economic_icon,
                economic_description: req.body.economic_description,
                economic_image: req.body.economic_image,

                world_icon: req.body.world_icon,
                world_title: req.body.world_title,
                world_section: req.body.world_section, // Array of objects [{ title: String, description: String }]
                world_subsection: req.body.world_subsection, // Array of objects [{ title: String, subtitle: String }]

                learning_title: req.body.learning_title,
                learning_image: req.body.learning_image,
                learning_subtitle: req.body.learning_subtitle,
                learning_description: req.body.learning_description,
                learning_below_subtitle: req.body.learning_below_subtitle,
                learning_skill: req.body.learning_skill, // Array of objects [{ title: String }]

                kordie_title: req.body.kordie_title,
                kordie_description: req.body.kordie_description,
                kordie_image: req.body.kordie_image,
                kordie_job_subtitle: req.body.kordie_job_subtitle,
                kordie_job_section: req.body.kordie_job_section, // Array of objects [{ image, title, description }]
                kordie_industries_title: req.body.kordie_industries_title,
                kordie_industries_section: req.body.kordie_industries_section, // Array of objects [{ title: String }]

                story_title: req.body.story_title,
                story_section: req.body.story_section, // Array of objects [{ description, image }]

                live_title: req.body.live_title,
                live_section: req.body.live_section, // Array of objects [{ title, description }]
                live_image: req.body.live_image,

                next_title: req.body.next_title,
                next_section: req.body.next_section, // Array of objects [{ icon, image, title, description }]

            };
            const result = await AboutService.updateAbout(req.params.id, data);
            next({ message: 'About updated successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // DELETE ABOUT
    async deleteAbout(req, res, next) {
        try {
            const result = await AboutService.deleteAbout(req.params.id);
            next({ message: 'About deleted successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // TOGGLE STATUS
    async toggleStatus(req, res, next) {
        try {
            console.log("toggle-status-------------");
            const result = await AboutService.toggleStatus(req.params.id);
            next({ message: 'Status toggled successfully', result });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = AboutController;
