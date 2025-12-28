const { ProductService } = require('../services');
const { CommonLib, StringLib, envs } = require("../../../lib");
const onlineProgramService = require('../services/onlineProgram.service');
const { default: mongoose } = require('mongoose');
function removeHtmlTags(str) {
    if (typeof str === 'string') {
      return str.replace(/<[^>]*>/g, '');
    }
    return str;
  }

const ProductController = {
    
    async createProduct(req, res, next) {
        try {
            const sanitizedCourseName = removeHtmlTags(req.body.course_name);
            const course_slug = StringLib.generateSlug(sanitizedCourseName);
            const data = {
                course_name: req.body.course_name,
                course_slug,
                course_description: req.body.course_description,
                course_intro: req.body.course_intro,
                sana_course_id: req.body.sana_course_id,
                course_topic: req.body.course_topic,
                course_time: req.body.course_time,
                course_goal: req.body.course_goal,
                course_category: req.body.course_category,
                course_teacher: req.body.course_teacher,
                course_type: req.body.course_type,
                course_image: req.body.course_image,
                course_price: req.body.course_price,
                last_updated_date: req.body.last_updated_date,
                course_price_text: req.body.course_price_text,
                course_certificate: req.body.course_certificate,
                course_link_text: req.body.course_link_text,
                course_link_membership_text: req.body.course_link_membership_text,
                learn_title: req.body.learn_title,
                learn_description: req.body.learn_description,
                learn_subtitle: req.body.learn_subtitle,
                learn_outcomes: req.body.learn_outcomes,
                address_title: req.body.address_title,
                address_description: req.body.address_description,
                address_image: req.body.address_image,
                syllabus_title: req.body.syllabus_title,
                syllabus: req.body.syllabus,
                curator_title: req.body.curator_title,
                kordie_title: req.body.kordie_title,
                plan_title: req.body.plan_title,
                plan_subtitle: req.body.plan_subtitle,
                plan_description: req.body.plan_description,
                plan_duration: req.body.plan_duration,
                course_impact_title: req.body.course_impact_title,
                course_impact_image: req.body.course_impact_image,
                course_impact_summary: req.body.course_impact_summary,
                course_impact_testinomial_heading: req.body.course_impact_testinomial_heading,
                course_impact_testinomial: req.body.course_impact_testinomial,
                course_next_title: req.body.course_next_title,
                course_next_subtitle: req.body.course_next_subtitle,
                course_next_id: req.body.course_next_id,
                faq_title: req.body.faq_title,
                course_interest: req.body.course_interest,
                course_industry: req.body.course_industry,
                whytakecourse: req.body.whytakecourse,
                course_tag: req.body.course_tag,
                skill_track:req.body.skill_track,
            };
            const result = await ProductService.createProduct(data);
            next({ message: 'Product created successfully', result });
        } catch (error) {
            next(error);
        }
    },

    async getAllProducts(req, res, next) {
        try {
            const { page, limit, course_name, is_active, active, is_feature, sortBy, ...filters } = req.query;
            
            const result = await ProductService.getAllProducts({ page, limit, course_name, is_active : is_active || active, is_feature, filters, sortBy });
            next(result);
        } catch (error) {
            next(error);
        }
    },

    async getSingleProduct(req, res, next) {
        try {
            const result = await ProductService.getSingleProduct(req.params.id);
            next(result);
        } catch (error) {
            next(error);
        }
    },


    async getBySlug(req, res, next) {
        try {
            const result = await ProductService.getBySlug(req.params.slug,req.user?.discount);
            next(result);
        } catch (error) {
            next(error);
        }
    },

    async getAnyProductBySlug(req, res, next) {
        try {
            const filter = {
                course_slug: req.params.slug,
                is_active: true,
                is_deleted: false,
            }
            const result = await ProductService.getAnyProductBySlug(filter);
            next(result);
        } catch (error) {
            next(error);
        }
    },

    async updateProduct(req, res, next) {
        try {
            const sanitizedCourseName = removeHtmlTags(req.body.course_name);
            const course_slug = StringLib.generateSlug(sanitizedCourseName);
            const data = {
                course_name: req.body.course_name,
                course_slug,
                course_description: req.body.course_description,
                course_intro: req.body.course_intro,
                sana_course_id: req.body.sana_course_id,
                course_topic: req.body.course_topic,
                course_time: req.body.course_time,
                course_goal: req.body.course_goal,
                course_category: req.body.course_category,
                course_teacher: req.body.course_teacher,
                course_type: req.body.course_type,
                course_image: req.body.course_image,
                course_price: req.body.course_price,
                last_updated_date:req.body.last_updated_date,
                course_price_text: req.body.course_price_text,
                course_certificate: req.body.course_certificate,
                course_link_text: req.body.course_link_text,
                course_link_membership_text: req.body.course_link_membership_text,
                learn_title: req.body.learn_title,
                learn_description: req.body.learn_description,
                learn_subtitle: req.body.learn_subtitle,
                learn_outcomes: req.body.learn_outcomes,
                address_title: req.body.address_title,
                address_description: req.body.address_description,
                address_image: req.body.address_image,
                syllabus_title: req.body.syllabus_title,
                syllabus: req.body.syllabus,
                curator_title: req.body.curator_title,
                kordie_title: req.body.kordie_title,
                plan_title: req.body.plan_title,
                plan_subtitle: req.body.plan_subtitle,
                plan_description: req.body.plan_description,
                plan_duration: req.body.plan_duration,
                course_impact_title: req.body.course_impact_title,
                course_impact_image: req.body.course_impact_image,
                course_impact_summary: req.body.course_impact_summary,
                course_impact_testinomial_heading: req.body.course_impact_testinomial_heading,
                course_impact_testinomial: req.body.course_impact_testinomial,
                course_next_title: req.body.course_next_title,
                course_next_subtitle: req.body.course_next_subtitle,
                course_next_id: req.body.course_next_id,
                faq_title: req.body.faq_title,
                course_interest: req.body.course_interest,
                course_industry: req.body.course_industry,
                whytakecourse: req.body.whytakecourse,
                course_tag: req.body.course_tag,
                skill_track:req.body.skill_track,
            };
            const result = await ProductService.updateProduct(req.params.id, data);
            next({ message: 'Product updated successfully', result });
        } catch (error) {
            next(error);
        }
    },

    async deleteProduct(req, res, next) {
        try {
            const result = await ProductService.deleteProduct(req.params.id);
            next({ message: 'Product deleted successfully', result });
        } catch (error) {
            next(error);
        }
    },

    async toggleStatus(req, res, next) {
        try {
            const result = await ProductService.toggleStatus(req.params.id);
            next({ message: 'Status toggled successfully', result });
        } catch (error) {
            next(error);
        }
    },

    async toggleFeature(req, res, next) {
        try {
            const result = await ProductService.toggleFeature(req.params.id);
            const programId = new mongoose.Types.ObjectId(req.params.id)
            const onlinePrograms = await onlineProgramService.getOnlinePrograms();
            
            if (!onlinePrograms) {
                await onlineProgramService.createProgram({courseId: [programId]});
            }
            else if (onlinePrograms && !onlinePrograms.courseId.some((course) => course.toString() === programId.toString())) {
                await onlineProgramService.updateProgram(onlinePrograms._id, {$push : { courseId: programId }});
            }
            next({ message: 'Feature toggled successfully', result });
        } catch (error) {
            next(error);
        }
    },

    async addRecentlyViewedCourse(req, res, next){
        const { courseId } = req.body;
        const userId = req.user._id;
        try {
            const result = await ProductService.addRecentlyViewedCourse(userId, courseId);
            next(result);
        } catch (error) {
            next(error);
        }
    },

    async getRecentlyViewedCourses(req, res, next){
        const userId = req?.user?._id;
        const { page, limit} = req.query;
        try {
          const result = await ProductService.getRecentlyViewedCourses({ userId, page, limit });
          next(result);
        } catch(error){
          next(error);
        }
    },

    async manageSavedCourse(req, res, next){
        const { courseId } = req.body;
        const userId = req.user._id;
        try {
            const result = await ProductService.manageSavedCourse(userId, courseId);
            next(result);
        } catch (error) {
            next(error);
        }
    },


    async getManageSavedCourse(req, res, next){
        const userId = req?.user?._id;
        const { page, limit} = req.query;
        try {
          const result = await ProductService.getManageSavedCourse({ userId, page, limit });
          next(result);
        } catch(error){
          next(error);
        }
    },


    async enrolledCourse(req, res, next){
        const { courseId } = req.body;
        const userId = req.user._id;
        try {
            const result = await ProductService.enrolledCourse(userId, courseId);
            next(result);
        } catch (error) {
            next(error);
        }
    },


    async getEnrolledCourse(req, res, next){
        const userId = req?.user?._id;
        const { page, limit} = req.query;
        try {
          const result = await ProductService.getEnrolledCourse({ userId, page, limit });
          next(result);
        } catch(error){
          next(error);
        }
    },



    async getAdminEnrolledCourse(req, res, next){
        const userId = req.params.id;
        const { page, limit} = req.query;
        try {
          const result = await ProductService.getEnrolledCourse({ userId, page, limit });
          next(result);
        } catch(error){
          next(error);
        }
    },
    
};

module.exports = ProductController;
