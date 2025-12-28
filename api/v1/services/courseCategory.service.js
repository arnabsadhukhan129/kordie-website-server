const AppConfig = require('../../../config/app.config');
const { NotFoundError } = require('../../../errors/http/http.errors');
const { CommonLib } = require('../../../lib');
const { CourseCategory,Product } = require('../db/models');
const s3Service = require('./s3.service'); 
// Helper to transform flattened keys to nested objects
function mapFlattenedToNested(input) {
    return {
        name: input.name,
        slug: input.slug,
        category_image: input.category_image,
        herosection: {
            title: input.herosection_title,
            subtitle: input.herosection_subtitle,
            description: input.herosection_description,
            media: input.herosection_media,
            type: input.herosection_type,
            link: input.herosection_link,
            tags: input.herosection_tags ? input.herosection_tags.split(',') : []
        },
        brandsection: {
            title: input.brandsection_title,
            description: input.brandsection_description,
            media: input.brandsection_media,
            type: input.brandsection_type
        },
        socialmedia: {
            name: input.socialmedia_name,
            image: input.socialmedia_image,
            description: input.socialmedia_description,
            link: input.socialmedia_link
        },
        crucialskillset: {
            title: input.crucialskillset_title
        },
        productsection: {
            title: input.productsection_title,
            description: input.productsection_description
        },
        collectionsection: {
            title: input.collection_title,
            description: input.collection_description
        },
        whylearn: {
            title: input.whylearn_title
        },
        relatedmaterial: {
            title: input.relatedmaterial_title,
            description: input.relatedmaterial_description,
            link: input.relatedmaterial_link
        },
        school: {
            title: input.school_title,
            description: input.school_description,
            media: input.school_media,
            type: input.school_type
        },
        faq: {
            title: input.faq_title
        },
        is_active: input.is_active !== undefined ? input.is_active : true,
        is_deleted: input.is_deleted || false
    };
}
function stripHtmlTags(str) {
    if (typeof str === 'string') {
      return str.replace(/<[^>]*>/g, '');
    }
    return str;
  }
const CourseCategoryService = {
    
    async createCategory(data, herosectionMedia, brandsectionMedia, socialmediaImage, schoolMedia, categoryImage) {
        if (herosectionMedia) {
            const uploadedherosectionMedia = await s3Service.uploadFile(herosectionMedia, 'media');
            data.herosection_media = uploadedherosectionMedia;
        }

        if(brandsectionMedia){
            const uploadedbrandsectionMedia = await s3Service.uploadFile(brandsectionMedia, 'media');
            data.brandsection_media = uploadedbrandsectionMedia;
        }

        if(socialmediaImage){
            const uploadedsocialmediaImage = await s3Service.uploadFile(socialmediaImage, 'images');
            data.socialmedia_image = uploadedsocialmediaImage;
        }

        if(schoolMedia){
            const uploadedschoolMedia = await s3Service.uploadFile(schoolMedia, 'media');
            data.school_media = uploadedschoolMedia;
        }

        if(categoryImage){
            const uploadedcategoryImage = await s3Service.uploadFile(categoryImage, 'images');
            data.category_image = uploadedcategoryImage;
        }
        const transformedData = mapFlattenedToNested(data);
        const existingCategory = await CourseCategory.findOne({ slug: data.slug, is_deleted: false });
    
        if (existingCategory) {
            throw new Error('Category Slug already exists'); 
        }

        try {
            const newCategory = await CourseCategory.create(transformedData);
            return { message: 'Category created successfully', data: newCategory };
        } catch (error) {
           return { message: 'Error creating Category', data: error };
        }
        
    },

    async updateCategory(id, input, herosectionMedia, brandsectionMedia, socialmediaImage, schoolMedia, categoryImage) {

        if (herosectionMedia) {
            const uploadedherosectionMedia = await s3Service.uploadFile(herosectionMedia, 'media');
            input.herosection_media = uploadedherosectionMedia;
        }

        if(brandsectionMedia){
            const uploadedbrandsectionMedia = await s3Service.uploadFile(brandsectionMedia, 'media');
            input.brandsection_media = uploadedbrandsectionMedia;
        }

        if(socialmediaImage){
            const uploadedsocialmediaImage = await s3Service.uploadFile(socialmediaImage, 'images');
            input.socialmedia_image = uploadedsocialmediaImage;
        }

        if(schoolMedia){
            const uploadedschoolMedia = await s3Service.uploadFile(schoolMedia, 'media');
            input.school_media = uploadedschoolMedia;
        }

        if(categoryImage){
            const uploadedcategoryImage = await s3Service.uploadFile(categoryImage, 'images');
            input.category_image = uploadedcategoryImage;
        }
        //const transformedData = mapFlattenedToNested(data);

     

        const existingData = await CourseCategory.findById(id);

        if (!existingData) {
            throw new Error('Category not found.');
        }

        // Merge existing data with new data
        const updatedData = {
            ...existingData.toObject(), // Convert Mongoose document to plain object
            name: input.name || existingData.name,
            slug: input.slug || existingData.slug,
            category_image: input.category_image || existingData.category_image,
            herosection: {
                title: input.herosection_title || existingData.herosection?.title,
                subtitle: input.herosection_subtitle || existingData.herosection?.subtitle,
                description: input.herosection_description || existingData.herosection?.description,
                media: input.herosection_media || existingData.herosection?.media,
                type: input.herosection_type || existingData.herosection?.type,
                link: input.herosection_link || existingData.herosection?.link,
                tags: input.herosection_tags
                    ? input.herosection_tags.split(',')
                    : existingData.herosection?.tags
            },
            brandsection: {
                title: input.brandsection_title || existingData.brandsection?.title,
                description: input.brandsection_description || existingData.brandsection?.description,
                media: input.brandsection_media || existingData.brandsection?.media,
                type: input.brandsection_type || existingData.brandsection?.type
            },
            socialmedia: {
                name: input.socialmedia_name || existingData.socialmedia?.name,
                image: input.socialmedia_image || existingData.socialmedia?.image,
                description: input.socialmedia_description || existingData.socialmedia?.description,
                link: input.socialmedia_link || existingData.socialmedia?.link
            },
            crucialskillset: {
                title: input.crucialskillset_title || existingData.crucialskillset?.title
            },
            productsection: {
                title: input.productsection_title || existingData.productsection?.title,
                description: input.productsection_description || existingData.productsection?.description
            },
            collectionsection: {
                title: input.collection_title || existingData.collectionsection?.title,
                description: input.collection_description || existingData.collectionsection?.description
            },
            whylearn: {
                title: input.whylearn_title || existingData.whylearn?.title
            },
            relatedmaterial: {
                title: input.relatedmaterial_title || existingData.relatedmaterial?.title,
                description: input.relatedmaterial_description || existingData.relatedmaterial?.description,
                link: input.relatedmaterial_link || existingData.relatedmaterial?.link
            },
            school: {
                title: input.school_title || existingData.school?.title,
                description: input.school_description || existingData.school?.description,
                media: input.school_media || existingData.school?.media,
                type: input.school_type || existingData.school?.type
            },
            faq: {
                title: input.faq_title || existingData.faq?.title
            },
            is_active: input.is_active !== undefined ? input.is_active : existingData.is_active,
            is_deleted: input.is_deleted !== undefined ? input.is_deleted : existingData.is_deleted
        };



        const existingCategory = await CourseCategory.findOne({ slug: updatedData.slug, _id: { $ne: id }, is_deleted: false });
    
        if (existingCategory) {
            throw new Error('Category Slug already exists'); 
        }
        const CategoryEdit = await CourseCategory.findByIdAndUpdate(id, updatedData, { new: true });
        if (!CategoryEdit) {
            throw new Error('Category not found.');
        }

        return CategoryEdit;
    },
  

    async  getCategory({ page, limit, name, active, sortby}) {
        const aggregate = {is_deleted:false};
        let category = [];
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
            case '5': // Show all active categories first, then inactive
                sort = { is_active: -1, createdAt: 1 }; // Active categories first, then sort by date
                break;
            case '6': // Show all active categories first, then inactive
                sort = { is_active: -1, createdAt: -1 }; // Active categories first, then sort by date
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
            total = await CourseCategory.countDocuments(query);
    
            // Calculate pagination
            pagination = CommonLib.getPagination(page, limit, total);
    
            // Retrieve users with pagination and type filter
            category = await CourseCategory.find(query)
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
            total = await CourseCategory.countDocuments(query);
    
            // Retrieve users with or without type filter
            category = await CourseCategory.find(query).sort(sort);
        }
    
        // Now you have the total count and pagination based on the 'type' variable.
        return { category, pagination };
    },


    async getCategoryWithProductCount({ page, limit, name, active, sortby }) {
        const aggregate = { is_deleted: false };
        let category = [];
        let offset;
        let total = null; // Initialize total as null
        let pagination = null;
    
        let sort = {};
        // Implement a switch-case statement for sorting
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
        const isActive = active === 'true';
        if (page && limit) {
            offset = CommonLib.getOffset(page, limit);
            const query = aggregate;
            if (name) {
                query.name = { $regex: new RegExp(name, 'i') };
            }
            if (active) {
                query.is_active = isActive; // Convert string to boolean
            }

            // Calculate the total count based on the query
            total = await CourseCategory.countDocuments(query);
    
            // Calculate pagination
            pagination = CommonLib.getPagination(page, limit, total);
    
            // Perform aggregation to get category data with product count
            category = await CourseCategory.aggregate([
                {
                    $match: query
                },
                {
                    $lookup: {
                        from: 'products', // Name of the Product collection
                        localField: '_id', // Match with the category _id
                        foreignField: 'course_category', // Reference field in the Product schema
                        as: 'products'
                    }
                },
                {
                    $addFields: {
                        productCount: { $size: '$products' } // Count the number of products in the category
                    }
                },
                {
                    $project: { // We project the fields we want
                        name: 1,
                        slug: 1,
                        productCount: 1,
                        category_image:1,
                        is_active: 1,
            "herosection_title": "$herosection.title",  // Fetch herosection.title
            "herosection_subtitle": "$herosection.subtitle", // Fetch herosection.subtitle
            "herosection_description": "$herosection.description", // Fetch herosection.description
            "herosection_media": "$herosection.media" // Fetch herosection.media
                    }
                },
                {
                    $sort: sort
                },
                {
                    $skip: offset
                },
                {
                    $limit: limit
                }
            ]);
        } else {
            const query = aggregate;
            if (name) {
                query.name = { $regex: new RegExp(name, 'i') };
            }
            if (active) {
                query.is_active = isActive; // Convert string to boolean
            }
    
            // Perform aggregation to get category data with product count
            category = await CourseCategory.aggregate([
                {
                    $match: query
                },
                {
                    $lookup: {
                        from: 'products', // Name of the Product collection
                        localField: '_id', // Match with the category _id
                        foreignField: 'course_category', // Reference field in the Product schema
                        as: 'products'
                    }
                },
                {
                    $addFields: {
                        productCount: { $size: '$products' } // Count the number of products in the category
                    }
                },
                {
                    $project: { // We project the fields we want
                        name: 1,
                        slug: 1,
                        productCount: 1,
                        category_image: 1,
                        is_active: 1,
            "herosection_title": "$herosection.title",  // Fetch herosection.title
            "herosection_subtitle": "$herosection.subtitle", // Fetch herosection.subtitle
            "herosection_description": "$herosection.description", // Fetch herosection.description
            "herosection_media": "$herosection.media" // Fetch herosection.media
                    }
                },
                {
                    $sort: sort
                }
            ]);
        }
    
        // Return the result with pagination
        return { category, pagination };
    },
    
    
    async getCategoryById(topicId){
        const category = await CourseCategory.findOne({_id: topicId});
        return category;
    },

    async deleteCategory(topicId){
      
        try {
           const CategoryDelete = await CourseCategory.findById(topicId);
            if (!CategoryDelete) {
                throw new NotFoundError('Category not found.');
            }
           // Retrieve all products that use this category
    const productsUsingCategory = await Product.find({
        course_category: topicId,
        is_deleted: false
      });
      if (productsUsingCategory.length > 0) {
        const productNames = productsUsingCategory
          .map(product => stripHtmlTags(product.course_name))
          .join(', ');
        throw new Error(
          `Category cannot be deleted. It is assigned to the following product(s): ${productNames}. Please unassign the category first.`
        );
      }
            await CourseCategory.findByIdAndDelete(topicId); 
            
            return CategoryDelete;
        } catch (error) {
            throw error;
        }

        //return CategoryDelete;
    },

    async toggleStatus(toggleId){
        try {
            //const schedulerId = req.params.id;
            const toggle = await CourseCategory.findById(toggleId);
            if (!toggle) {
                throw new NotFoundError('Not found');
            }
          
    const productsUsingCategory = await Product.find({
        course_category: toggleId,
        is_deleted: false
      });
      if (productsUsingCategory.length > 0) {
        const productNames = productsUsingCategory
          .map(product => stripHtmlTags(product.course_name))
          .join(', ');
        throw new Error(
          `Category Status cannot be Updated. It is assigned to the following product(s): ${productNames}. Please unassign the category first.`
        );
      }
            toggle.is_active = !toggle.is_active;
            await toggle.save();
            const message= 'Status toggled successfully';
            return { toggle, message };
        } catch (error) {
            throw error;
        }
    },

    async getBySlug(slug){
        const category = await CourseCategory.findOne({slug: slug});
        return category;
    },
    

};

module.exports = CourseCategoryService;