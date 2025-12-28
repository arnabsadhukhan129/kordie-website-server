const { ImpactService } = require('../services');

const ImpactController = {
    // CREATE IMPACT
    async createImpact(req, res, next) {
        try {
            const data = {
                impact_title: req.body.impact_title,
                impact_video: req.body.impact_video,
                impact_subtitle: req.body.impact_subtitle,
                impactsubsection: req.body.impactsubsection,  // Expecting an array of objects [{ image: String, title: String }]
                hospitality_title: req.body.hospitality_title,
                hospitality_subtitle: req.body.hospitality_subtitle,
                hospitality_description: req.body.hospitality_description,
                hospitality_image: req.body.hospitality_image,
                hospitality_features: req.body.hospitality_features,  // Expecting an array of objects [{ title: String }]
                hospitality_bottom_subtitle: req.body.hospitality_bottom_subtitle,
                employer_title: req.body.employer_title,
                employer_description: req.body.employer_description,
                employer_stats: req.body.employer_stats,  // Expecting an array of objects [{ image: String, stat: String, description: String }]
                employer_action: req.body.employer_action,
                student_title: req.body.student_title,
                student_subtitle: req.body.student_subtitle,
                student_description: req.body.student_description,
                student_image: req.body.student_image,
                student_action: req.body.student_action,
                sustainability_title: req.body.sustainability_title,
                sustainability_description: req.body.sustainability_description,
                sustainability_program: req.body.sustainability_program,  // Expecting an array of objects [{ image: String, description: String }]
                sustainability_text: req.body.sustainability_text,
                sustainability_strategy_title: req.body.sustainability_strategy_title,
                sustainability_strategy_description: req.body.sustainability_strategy_description,
                sustainability_strategy_program: req.body.sustainability_strategy_program,  // Expecting an array of objects [{ icon: String, image: String, description: String, title: String, action_url: String }]
                sustainability_strategy_subtitle: req.body.sustainability_strategy_subtitle,
                sustainability_strategy_text: req.body.sustainability_strategy_text,
                sustainability_image: req.body.sustainability_image,
                goal_title: req.body.goal_title,
                goal_icon: req.body.goal_icon,
                goal_image: req.body.goal_image,
                goal_description: req.body.goal_description,
                goal_social_title: req.body.goal_social_title,
                goal_social: req.body.goal_social,  // Expecting an array of objects [{ icon: String, title: String }]
                goal_climate_title: req.body.goal_climate_title,
                goal_climate: req.body.goal_climate,  // Expecting an array of objects [{ icon: String, title: String }]
                more_title: req.body.more_title,
                more_program: req.body.more_program,  // Expecting an array of objects [{ image: String, title: String, date: Date }]
                is_active: req.body.is_active !== undefined ? req.body.is_active : true,
                is_deleted: req.body.is_deleted !== undefined ? req.body.is_deleted : false
            };
            
            const result = await ImpactService.createImpact(data);
            next({ message: 'Impact created successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // GET ALL IMPACTS
    async getAllImpacts(req, res, next) {
        try {
            const { page, limit, title, active, sortBy } = req.query;
            const result = await ImpactService.getAllImpacts({ page, limit, title, active, sortBy });
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // GET SINGLE IMPACT
    async getSingleImpact(req, res, next) {
        try {
            const result = await ImpactService.getSingleImpact(req.params.id);
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // UPDATE IMPACT
    async updateImpact(req, res, next) {
        try {
            const data = {
                impact_title: req.body.impact_title,
                impact_video: req.body.impact_video,
                impact_subtitle: req.body.impact_subtitle,
                impactsubsection: req.body.impactsubsection,  // Expecting an array of objects [{ image: String, title: String }]
                hospitality_title: req.body.hospitality_title,
                hospitality_subtitle: req.body.hospitality_subtitle,
                hospitality_description: req.body.hospitality_description,
                hospitality_image: req.body.hospitality_image,
                hospitality_features: req.body.hospitality_features,  // Expecting an array of objects [{ title: String }]
                hospitality_bottom_subtitle: req.body.hospitality_bottom_subtitle,
                employer_title: req.body.employer_title,
                employer_description: req.body.employer_description,
                employer_stats: req.body.employer_stats,  // Expecting an array of objects [{ image: String, stat: String, description: String }]
                employer_action: req.body.employer_action,
                student_title: req.body.student_title,
                student_subtitle: req.body.student_subtitle,
                student_description: req.body.student_description,
                student_image: req.body.student_image,
                student_action: req.body.student_action,
                sustainability_title: req.body.sustainability_title,
                sustainability_description: req.body.sustainability_description,
                sustainability_program: req.body.sustainability_program,  // Expecting an array of objects [{ image: String, description: String }]
                sustainability_text: req.body.sustainability_text,
                sustainability_strategy_title: req.body.sustainability_strategy_title,
                sustainability_strategy_description: req.body.sustainability_strategy_description,
                sustainability_strategy_program: req.body.sustainability_strategy_program,  // Expecting an array of objects [{ icon: String, image: String, description: String, title: String, action_url: String }]
                sustainability_strategy_subtitle: req.body.sustainability_strategy_subtitle,
                sustainability_strategy_text: req.body.sustainability_strategy_text,
                sustainability_image: req.body.sustainability_image,
                goal_title: req.body.goal_title,
                goal_icon: req.body.goal_icon,
                goal_image: req.body.goal_image,
                goal_description: req.body.goal_description,
                goal_social_title: req.body.goal_social_title,
                goal_social: req.body.goal_social,  // Expecting an array of objects [{ icon: String, title: String }]
                goal_climate_title: req.body.goal_climate_title,
                goal_climate: req.body.goal_climate,  // Expecting an array of objects [{ icon: String, title: String }]
                more_title: req.body.more_title,
                more_program: req.body.more_program,  // Expecting an array of objects [{ image: String, title: String, date: Date }]
                is_active: req.body.is_active !== undefined ? req.body.is_active : true,
                is_deleted: req.body.is_deleted !== undefined ? req.body.is_deleted : false
            };
            const result = await ImpactService.updateImpact(req.params.id, data);
            next({ message: 'Impact updated successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // DELETE IMPACT
    async deleteImpact(req, res, next) {
        try {
            const result = await ImpactService.deleteImpact(req.params.id);
            next({ message: 'Impact deleted successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // TOGGLE STATUS
    async toggleStatus(req, res, next) {
        try {
            const result = await ImpactService.toggleStatus(req.params.id);
            next({ message: 'Status toggled successfully', result });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = ImpactController;
