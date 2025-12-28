const {CourseCategoryService} = require('../services');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { CommonLib, StringLib, envs } = require("../../../lib");
function removeHtmlTags(str) {
    if (typeof str === 'string') {
      return str.replace(/<[^>]*>/g, '');
    }
    return str;
  }
const CourseCategoryController = {

    // CREATE A TITLE
    createCategory:[
    upload.fields([
            { name: 'category_image', maxCount: 1 },
            { name: 'herosection_media', maxCount: 1 },
            { name: 'brandsection_media', maxCount: 1 },
            { name: 'socialmedia_image', maxCount: 1 },
            { name: 'school_media', maxCount: 1 },
    ]),
    async (req,res,next) => {
        try{
             const sanitizedCategoryName = removeHtmlTags(req.body.name);
             const slug = StringLib.generateSlug(sanitizedCategoryName);
            let data = req.body;
            data.slug = slug
            const herosectionMedia = req.files?.herosection_media?.[0];
            const brandsectionMedia = req.files?.brandsection_media?.[0];
            const socialmediaImage = req.files?.socialmedia_image?.[0];
            const schoolMedia = req.files?.school_media?.[0];
            const categoryImage = req.files?.category_image?.[0];
            const category = await CourseCategoryService.createCategory(data, herosectionMedia, brandsectionMedia, socialmediaImage, schoolMedia, categoryImage);
            next(category);
        }
        catch(err){
            next(err);
        }
    },
    ],
    

    // GET ALL TITLE
    async getAllCategory(req,res,next){
        try{        
            const categoryList = await CourseCategoryService.getCategory({
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 0,
                name: req.query.name,
                active: req.query.active,
                sortby: req.query.sortBy,
            });
            next(categoryList);
        }
        catch(err){
            next(err);
        }
    },


        // GET ALL TITLE
        async getCategoryWithProductCount(req,res,next){
            try{        
                const categoryList = await CourseCategoryService.getCategoryWithProductCount({
                    page: parseInt(req.query.page) || 0,
                    limit: parseInt(req.query.limit) || 0,
                    name: req.query.name,
                    active: req.query.active,
                    sortby: req.query.sortBy,
                });
                next(categoryList);
            }
            catch(err){
                next(err);
            }
        },

    // DELETE TITLE
    async deleteCategory(req,res,next){
        try{
            //const {id} = req.body;
            const categoryList = await CourseCategoryService.deleteCategory(req.params.id);
            next(categoryList);
        }
        catch(err){
            next(err);
        }
    },

    // UPDATE TITLE
    updateCategory:[
    upload.fields([
            { name: 'category_image', maxCount: 1 },
            { name: 'herosection_media', maxCount: 1 },
            { name: 'brandsection_media', maxCount: 1 },
            { name: 'socialmedia_image', maxCount: 1 },
            { name: 'school_media', maxCount: 1 },
    ]),
    async (req,res,next) => {
        try{
            const sanitizedCategoryName = removeHtmlTags(req.body.name);
            const slug = StringLib.generateSlug(sanitizedCategoryName);
            let data = req.body;
            data.slug = req.body?.slug || slug;
            const herosectionMedia = req.files?.herosection_media?.[0];
            const brandsectionMedia = req.files?.brandsection_media?.[0];
            const socialmediaImage = req.files?.socialmedia_image?.[0];
            const schoolMedia = req.files?.school_media?.[0];
            const categoryImage = req.files?.category_image?.[0];
            const category = await CourseCategoryService.updateCategory(req.params.id, data , herosectionMedia, brandsectionMedia, socialmediaImage, schoolMedia, categoryImage);
            next(category);
        }
        catch(err){
            next(err);
        }
    },
    ],

    //GET ONE TITLE
    async getSingleCategory(req,res,next){
        try{
            const {id} = req.params;
            const category = await CourseCategoryService.getCategoryById(id);
            next(category);
        }
        catch(err){
            next(err);
        }
    },
    async toggleStatus(req, res, next) {
        try {
        const toggleId = req.params.id;
        const toggle = await CourseCategoryService.toggleStatus(toggleId);
        next(toggle);
        } 
        catch(e) {
        next(e);
        }

      },


          //GET ONE TITLE
    async getBySlug(req,res,next){
        try{
            const {slug} = req.params;
            const category = await CourseCategoryService.getBySlug(slug);
            next(category);
        }
        catch(err){
            next(err);
        }
    },
};

module.exports = CourseCategoryController;