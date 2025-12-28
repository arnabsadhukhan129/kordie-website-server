const AppConfig = require('../../../config/app.config');
const { NotFoundError } = require('../../../errors/http/http.errors');
const { CommonLib } = require('../../../lib');
const { Blog ,Category,BlogType} = require('../db/models');
const mongoose = require('mongoose');
const s3Service = require('./s3.service'); 
const BlogService = {
    async createBlog(data,file,vfile) {
        const meta = {
            "title": "",
            "description": "",
            "keywords": []
        };

        meta.title = data.meta_title;
        meta.description = data.meta_description;
        meta.keywords = JSON.parse(data.meta_keywords);

        const blogdata = {
            title: data.title,
            slug: data.slug,
            description: data.description,
            categoryId:data.categoryId,
            author:data.author,
            date:data.date,
            timetoread:data.timetoread,
            meta:meta,
            course_category: data.course_category ? JSON.parse(data.course_category) : [], // Default to an empty array,
            course_type:data.course_type || null,
            blog_type:data.blog_type ? JSON.parse(data.blog_type) : []
        };
        const existingBlog = await Blog.findOne({ slug: blogdata.slug, is_deleted: false });
    
        if (existingBlog) {
            // The title already exists, handle the case accordingly
            throw new Error('Slug already exists'); 
        }

        if (file) {
            const imageUrl = await s3Service.uploadFile(file, 'images');
            blogdata.image = imageUrl;
        }

        if (vfile) {
            const videoUrl = await s3Service.uploadFile(vfile, 'videos');
            blogdata.video = videoUrl;
        }

        try {
            const newBlog = await Blog.create(blogdata);
            return { message: 'Blog created successfully', data: newBlog };
        } catch (error) {
            // Handle the error if the creation fails
            return { message: 'Error creating Blog', data: error };
        }
        //return await BlogModel.create(data);
    },

    async updateBlog(topicId, data, file, vfile) {
        const meta = {
            "title": "",
            "description": "",
            "keywords": []
        };

        meta.title = data.meta_title;
        meta.description = data.meta_description;
        meta.keywords = JSON.parse(data.meta_keywords);

        const blogdata = {
            title: data.title,
            slug: data.slug,
            description: data.description,
            categoryId:data.categoryId,
            author:data.author,
            date:data.date,
            timetoread:data.timetoread,
            meta:meta,
            course_category:data.course_category ? JSON.parse(data.course_category) : [], // Default to an empty array,,
            course_type:data.course_type || null,
            blog_type:data.blog_type ? JSON.parse(data.blog_type) : []
        };
        const existingBlog = await Blog.findOne({ slug: blogdata.slug, _id: { $ne: topicId }, is_deleted: false });
    
        if (existingBlog) {
             throw new Error('Slug already exists'); 
        }
        if (file) {
            const imageUrl = await s3Service.uploadFile(file, 'images');
            blogdata.image = imageUrl;
        }
        if (vfile) {
            const videoUrl = await s3Service.uploadFile(vfile, 'videos');
            blogdata.video = videoUrl;
        }
        const BlogEdit = await Blog.findByIdAndUpdate(topicId, blogdata, { new: true });
        
        if (!BlogEdit) {
            throw new Error('Blog not found.');
        }

        return BlogEdit;
    },
  

    async  getBlog({ page, limit, title, active, sortby, category, slug, course_category, blog_type}) {
        const aggregate = {is_deleted:false};
        let blog = [];
        let offset;
        let total = null; // Initialize total as null
        let pagination = null;

        let sort = {};
        // Implement a switch-case statement
        switch (sortby) {
            case '1':
                sort = { title: 1 }
                break;
            case '2':
                sort = { title: -1 }
                break;
            case '3':
                sort = { createdAt: 1 }
                break;
            case '4':
                sort = { createdAt: -1 }
                break;
            default:
                sort = { createdAt: 1 }
            }
            if (category) {
                aggregate.categoryId = category; // Filter by category if provided
            }
            if(slug){
                const category = await Category.findOne({ slug: slug, is_deleted: false });
                aggregate.categoryId = category._id;
            }

                // Filter by course_category
            if (course_category) {
                aggregate.course_category = { $in: Array.isArray(course_category) ? course_category : [course_category] };
            }

            if (blog_type && blog_type.length > 0) {
                const blockIds = await BlogType.find({
                    name: { $in: blog_type.map(type => new RegExp(type, 'i')) } // Case-insensitive match
                }).distinct('_id');
                aggregate.blog_type = { $in: blockIds };
            }
   
        if (page && limit) {
            offset = CommonLib.getOffset(page, limit);
            const query = aggregate;
            if (title) {
                query.title = { $regex: new RegExp(title, 'i') };
            }
            if (active){
                query.is_active = active;
            }
    
            // Calculate the total count based on the query
            total = await Blog.countDocuments(query);
    
            // Calculate pagination
            pagination = CommonLib.getPagination(page, limit, total);
    
            // Retrieve users with pagination and type filter
            blog = await Blog.find(query).populate('categoryId')
                .sort(sort)
                .skip(offset)
                .limit(limit)
                .populate('course_category', 'name') 
                .populate('blog_type', 'name'); 
                
        } else {
            const query = aggregate;
            if (title) {
                query.title = { $regex: new RegExp(title, 'i') };
            }
           
            if (active){
               query.is_active = active;
            }

            // Calculate the total count based on the query
            total = await Blog.countDocuments(query);

            // Retrieve users with or without type filter
            blog = await Blog.find(query).populate('categoryId').sort(sort)
            .populate('course_category', 'name') 
            .populate('blog_type', 'name');  

        }
    
        // Now you have the total count and pagination based on the 'type' variable.
        return { blog, pagination };
    },
    
    async getBlogById(topicId){
        const grade = await Blog.findOne({_id: topicId});
        return grade;
    },

    async getBySlug(topicId){
        const grade = await Blog.findOne({slug: topicId});
        return grade;
    },

    async deleteBlog(topicId){
      
        try {
           const BlogDelete = await Blog.findById(topicId);
            if (!BlogDelete) {
                throw new NotFoundError('Blog not found.');
            }
            await Blog.findByIdAndDelete(topicId);
            const message= 'Blog deleted successfully';
            return { BlogDelete, message };
        } catch (error) {
            throw error;
        }

        //return BlogDelete;
    },

    async toggleStatus(toggleId){
        try {
            //const schedulerId = req.params.id;
            const toggle = await Blog.findById(toggleId);
            if (!toggle) {
                throw new NotFoundError('Not found');
            }
            toggle.is_active = !toggle.is_active;
            await toggle.save();
            const message= 'Status toggled successfully';
            return { toggle, message };
        } catch (error) {
            throw error;
        }
    },
    
    async toggleFeature(toggleId){
        try {
            //const schedulerId = req.params.id;
            const toggle = await Blog.findById(toggleId);
            if (!toggle) {
                throw new NotFoundError('Not found');
            }
            toggle.featured = !toggle.featured;
            await toggle.save();
            const message= 'Feature toggled successfully';
            return { toggle, message };
        } catch (error) {
            throw error;
        }
    },


    async getTwoFeaturedBlogsPerCategory(category) {
        if (category === "All") {
            // Fetch 2 most recent featured blogs across all categories
            const recentBlogs = await Blog.find({ featured: true, is_deleted: false, is_active: true })
                .sort({ createdAt: -1 }) // Sort by most recent
                .limit(2); // Limit to 2 blogs
    
            // Return consistent response structure
            return {
                categoryId: "All",
                blogs: recentBlogs,
            };
        }
    
        // Convert the category to ObjectId
        const categoryId = new mongoose.Types.ObjectId(category);
    
        // Fetch 2 featured blogs for a specific category
        const featuredBlogs = await Blog.aggregate([
            { $match: { featured: true, is_deleted: false, is_active: true, categoryId } }, // Match specific category
            {
                $group: {
                    _id: "$categoryId", // Group by category
                    blogs: { $push: "$$ROOT" }, // Collect all blogs in this category
                },
            },
            {
                $project: {
                    categoryId: "$_id",
                    blogs: { $slice: ["$blogs", 2] }, // Limit to 2 featured blogs per category
                    _id: 0,
                },
            },
        ]);
    
        // Return consistent response structure
        return featuredBlogs.length > 0
            ? featuredBlogs[0] // Extract the first (and only) group
            : { categoryId, blogs: [] }; // Fallback for empty results
    }
    
    

};

module.exports = BlogService;