const {BlogService} = require('../services');
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
const BlogController = {

    // CREATE A TITLE
    createBlog:[
    upload.fields([{ name: 'image', maxCount: 1 },{ name: 'video', maxCount: 1 }]),
    async (req,res,next)=>{
        try{
             const sanitizedBlog = removeHtmlTags(req.body.title);
            const slug = StringLib.generateSlug(sanitizedBlog);
            let data = req.body;
               
                // Trim the title to remove leading/trailing spaces
                data.title = data.title ? data.title.trim() : "";
                // Validate the title field
            if (!data.title || !/[a-zA-Z0-9]+/.test(data.title)) {
                throw new Error("Blog title must contain meaningful text and cannot be blank.");
            }
            data.slug = slug
            const imageFile = req.files?.image?.[0];
            const videoFile = req.files?.video?.[0];
            const title = await BlogService.createBlog(data, imageFile, videoFile);
            next(title);
        }
        catch(err){
            next(err);
        }
    },
    ],

    // GET ALL TITLE
    async getAllBlog(req,res,next){
        try{        
            //console.log(req.query.active,"oooooooooooooooooooooooooo");  
            const titleList = await BlogService.getBlog({
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 0,
                title: req.query.title,
                active: req.query.active,
                sortby: req.query.sortBy,
                category: req.query.category,
                slug: req.query.slug,
                course_category: req.query.course_category,
                blog_type: req.query.blog_type ? req.query.blog_type.split(',') : [],
            });
            next(titleList);
        }
        catch(err){
            next(err);
        }
    },

    // DELETE TITLE
    async deleteBlog(req,res,next){
        try{
            //const {id} = req.body;
            const titleList = await BlogService.deleteBlog(req.params.id);
            next(titleList);
        }
        catch(err){
            next(err);
        }
    },

    // UPDATE TITLE
    updateBlog:[
    upload.fields([{ name: 'image', maxCount: 1 },{ name: 'video', maxCount: 1 }]),
    async (req,res,next)=>{
        try{
            
            const sanitizedBlog = removeHtmlTags(req.body.title);
            const slug = StringLib.generateSlug(sanitizedBlog);
            const data = req.body;
                // Trim the title to remove leading/trailing spaces
                data.title = data.title ? data.title.trim() : "";
                // Validate the title field
            if (!data.title || !/[a-zA-Z0-9]+/.test(data.title)) {
                throw new Error("Blog title must contain meaningful text and cannot be blank.");
            }
            data.slug = slug
            const imageFile = req.files?.image?.[0];
            const videoFile = req.files?.video?.[0];
            
            const title = await BlogService.updateBlog(req.params.id,data,imageFile,videoFile);
            next(title);
        }
        catch(err){
            next(err);
        }
    },
    ],

    //GET ONE TITLE
    async getSingleBlog(req,res,next){
        try{
            //console.log("Controller executed--------------", req.query, req.params);
            const {id} = req.params;
            const title = await BlogService.getBlogById(id);
            next(title);
        }
        catch(err){
            next(err);
        }
    },

        //GET ONE TITLE
        async getBySlug(req,res,next){
            try{
                //console.log("Controller executed--------------", req.query, req.params);
                const {slug} = req.params;
                const title = await BlogService.getBySlug(slug);
                next(title);
            }
            catch(err){
                next(err);
            }
        },
    async toggleStatus(req, res, next) {
        try {
        const toggleId = req.params.id;
        const toggle = await BlogService.toggleStatus(toggleId);
        next(toggle);
        } 
        catch(e) {
        next(e);
        }

      },
      async toggleFeature(req, res, next) {
        try {
        const toggleId = req.params.id;
        const toggle = await BlogService.toggleFeature(toggleId);
        next(toggle);
        } 
        catch(e) {
        next(e);
        }

      },

      async getTwoFeaturedBlogsPerCategory(req, res, next){
        try {
            const { category } = req.query; // Expecting a query parameter like ?category=All
            console.log(category);
            const featuredBlogs = await BlogService.getTwoFeaturedBlogsPerCategory(category || "All");
            next(featuredBlogs);
        } catch (err) {
            next(err);
        }
      }
};

module.exports = BlogController;