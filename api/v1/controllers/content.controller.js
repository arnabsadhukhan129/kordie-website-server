const contentService = require('../services/content.service');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

const contentController = {
    createContent: [
        async (req, res, next) => {
            try {
                const content = await contentService.createContent(req.body);
                next({ message: 'Content created successfully', data: content });
            } catch (error) {
                next(error);
            }
        }
    ],

    editContent: [
        async (req, res, next) => {
            try {
                const content = await contentService.editContent(req.params.id, req.body);
                next({ message: 'Content updated successfully', data: content });
            } catch (error) {
                next(error);
            }
        }
    ],

        // Controller to fetch content by URL
        async getContentByUrl(req, res, next) {
            try {
                const { url } = req.params;
                console.log(url);
                const content = await contentService.getContentByUrl(url);
                next(content);
            } catch (error) {
                next(error);
            }
        },

                // Controller to fetch content by URL
                async getSingleContent(req, res, next) {
                    try {
                        const { id } = req.params;
                        
                        const content = await contentService.getSingleContent(id);
                        next(content);
                    } catch (error) {
                        next(error);
                    }
                },
            
    
        // Controller to toggle active/inactive status
        async toggleActiveStatus(req, res, next) {
            try {
                const { id } = req.params;
                const updatedContent = await contentService.toggleActiveStatus(id);
                next(updatedContent);
            } catch (error) {
                next(error);
            }
        },


            // GET ALL TITLE
        async getAllContent(req,res,next){
        try{        
            const contentList = await contentService.getAllContent({
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 0,
                title: req.query.title,
                active: req.query.active,
                sortby: req.query.sortBy,
            });
            next(contentList);
        }
        catch(err){
            next(err);
        }
        },

    
    uploadMedia:[
        upload.fields([{ name: 'media', maxCount: 1 }]),
        async (req,res,next)=>{
            try{
                const media = req.files?.media?.[0];
                const file = await contentService.uploadMedia(media);
                next(file);
            }
            catch(err){
                next(err);
            }
        },
    ],

            
            async deleteMedia(req, res, next) {
                try {
                   
                    const content = await contentService.deleteMedia(req.query.key);
                    next(content);
                } catch (error) {
                    next(error);
                }
            },
};

module.exports = contentController;