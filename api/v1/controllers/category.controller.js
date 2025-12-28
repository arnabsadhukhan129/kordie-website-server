const {CategoryService} = require('../services');
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
const CategoryController = {

    // CREATE A TITLE

    async createCategory(req,res,next){
        try{
            const sanitizedCategoryName = removeHtmlTags(req.body.name);
            const slug = StringLib.generateSlug(sanitizedCategoryName);
            let data = req.body;
            // Validate the name field
            if (!data.name || data.name.trim() === "") {
                throw new Error("Category name cannot be empty.");
            }
            data.slug = slug;
            const category = await CategoryService.createCategory(data);
            next(category);
        }
        catch(err){
            next(err);
        }
    },
    

    // GET ALL TITLE
    async getAllCategory(req,res,next){
        try{        
            const categoryList = await CategoryService.getCategory({
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
            const categoryList = await CategoryService.deleteCategory(req.params.id);
            next(categoryList);
        }
        catch(err){
            next(err);
        }
    },

    // UPDATE TITLE
    async updateCategory(req,res,next){
        try{
            const sanitizedCategoryName = removeHtmlTags(req.body.name);
            const slug = StringLib.generateSlug(sanitizedCategoryName);
            const data = req.body;
            if (!data.name || data.name.trim() === "") {
                throw new Error("Category name cannot be empty.");
            }
            data.slug =slug;
            const category = await CategoryService.updateCategory(req.params.id,data);
            next(category);
        }
        catch(err){
            next(err);
        }
    },

    //GET ONE TITLE
    async getSingleCategory(req,res,next){
        try{
            const {id} = req.params;
            const category = await CategoryService.getCategoryById(id);
            next(category);
        }
        catch(err){
            next(err);
        }
    },

        //GET ONE TITLE
        async getBySlug(req,res,next){
            try{
                const {slug} = req.params;
                const category = await CategoryService.getBySlug(slug);
                next(category);
            }
            catch(err){
                next(err);
            }
        },
    async toggleStatus(req, res, next) {
        try {
        const toggleId = req.params.id;
        const toggle = await CategoryService.toggleStatus(toggleId);
        next(toggle);
        } 
        catch(e) {
        next(e);
        }

      },
};

module.exports = CategoryController;