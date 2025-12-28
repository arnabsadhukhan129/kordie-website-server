const AppConfig = require('../../../config/app.config');
const { NotFoundError } = require('../../../errors/http/http.errors');
const { CommonLib } = require('../../../lib');
const { Category,Blog } = require('../db/models');
const CategoryService = {
    async createCategory(data) {
        const topicdata = {
            //name: data.name.toLowerCase().trim(),
            name: data.name,
            description: data.description,
            slug: data.slug
        };
        const existingCategory = await Category.findOne({ slug: topicdata.slug, is_deleted: false });
    
        if (existingCategory) {
            // The name already exists, handle the case accordingly
            throw new Error('Slug already exists, please choose diffrent name'); 
        }

        try {
            const newCategory = await Category.create(topicdata);
            return { message: 'Category created successfully', data: newCategory };
        } catch (error) {
            // Handle the error if the creation fails
            return { message: 'Error creating Category', data: error };
        }
        //return await CategoryModel.create(data);
    },

    async updateCategory(topicId, updatedDetails, file) {
        const topicdata = {
            //name: updatedDetails.name.toLowerCase().trim(),
            name: updatedDetails.name,
            description: updatedDetails.description,
            slug: updatedDetails.slug
        };
        const existingCategory = await Category.findOne({ slug: topicdata.slug, _id: { $ne: topicId }, is_deleted: false });
    
        if (existingCategory) {
            // The name already exists, handle the case accordingly
            throw new Error('Slug already exists, please choose diffrent name'); 
        }
        const CategoryEdit = await Category.findByIdAndUpdate(topicId, topicdata, { new: true });
        //console.log("pppppppppppppppppppppp"+topicId);
        if (!CategoryEdit) {
            throw new Error('Category not found.');
        }

        return CategoryEdit;
    },
  

    async  getCategory({ page, limit, name, active, sortby}) {
        const aggregate = {is_deleted:false};
        let topics = [];
        let offset;
        let total = null; // Initialize total as null
        let pagination = null;

        let sort = {};
        // Implement a switch-case statement
        switch (sortby) {
            case '1':
                sort = { name: 1 }
                break;
            case '2':
                sort = { name: -1 }
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
   
        if (page && limit) {
            offset = CommonLib.getOffset(page, limit);
            const query = aggregate;
            if (name) {
                query.name = { $regex: new RegExp(name, 'i') };
            }
            if (active){
                query.is_active = active;
            }
    
            // Calculate the total count based on the query
            total = await Category.countDocuments(query);
    
            // Calculate pagination
            pagination = CommonLib.getPagination(page, limit, total);
    
            // Retrieve users with pagination and type filter
            topics = await Category.find(query)
                .sort(sort)
                .skip(offset)
                .limit(limit)
                ;
        } else {
            const query = aggregate;
            if (name) {
                query.name = { $regex: new RegExp(name, 'i') };
            }
           
            if (active){
               query.is_active = active;
            }
    
            // Calculate the total count based on the query
            total = await Category.countDocuments(query);
    
            // Retrieve users with or without type filter
            topics = await Category.find(query).sort(sort);
        }
    
        // Now you have the total count and pagination based on the 'type' variable.
        return { topics, pagination };
    },
    
    async getCategoryById(topicId){
        const grade = await Category.findOne({_id: topicId});
        return grade;
    },

    async getBySlug(topicId){
        const grade = await Category.findOne({slug: topicId,is_deleted: false});
        return grade;
    },

    async deleteCategory(topicId){
      
        try {
           const CategoryDelete = await Category.findById(topicId);
            if (!CategoryDelete) {
                throw new NotFoundError('Category not found.');
            }
                 
        // Check if any blog is using this category
        const blogUsingCategory = await Blog.findOne({ categoryId: topicId });

        if (blogUsingCategory) {
            throw new Error('Cannot delete category, it is assigned to a blog');
        }
            await Category.findByIdAndDelete(topicId);
            const message= 'Category deleted successfully';
            return { CategoryDelete, message };
        } catch (error) {
            throw error;
        }

        //return CategoryDelete;
    },

    async toggleStatus(toggleId){
        try {
            //const schedulerId = req.params.id;
            const toggle = await Category.findById(toggleId);
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
    

};

module.exports = CategoryService;