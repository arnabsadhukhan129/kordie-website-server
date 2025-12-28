const {LearnWithKordieService} = require('../services');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { CommonLib, StringLib, envs } = require("../../../lib");
const {NotFoundError,UnprocessableEntityError} = require('../../../errors/http/http.errors');
const s3Service = require('../services/s3.service'); 
const LearnWithKordieController = {
    // Create a new LearnWithKordie
    create:[
    upload.fields([{ name: 'image', maxCount: 1 },{ name: 'icon', maxCount: 1 }]),
    async (req, res, next) => {
        try {
            if(!req.body.category_id){
                throw new UnprocessableEntityError("Cannot create Learn with Cordie without Category")
            }
            let data = {
                // Required fields
                title: req.body.title,
                key: StringLib.generateSlug(req.body.title),
                description: req.body.description,
                category_id : req.body.category_id
            };
            if (req.files?.image) {
                const mediaFile = req.files.image[0];
                const uploadedMedia = await s3Service.uploadFile(mediaFile, 'image');
                data.image = uploadedMedia;
            }
            if (req.files?.icon) {
                const mediaFile = req.files.icon[0];
                const uploadedMedia = await s3Service.uploadFile(mediaFile, 'icon');
                data.icon = uploadedMedia;
            }
            const result = await LearnWithKordieService.create(data);
            next(result);
        } catch (err) {
            next(err);
        }
    },
   ],

    
    async getAll(req, res, next) {
        try {
            const result = await LearnWithKordieService.getAll({
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 0,
                title: req.query.title,
                active: req.query.active,
                sortby: req.query.sortBy,
            });
            next(result);
        } catch (err) {
            next(err);
        }
    },
   

    // Get a LearnWithKordie by key
    async getByKey(req, res, next) {
        try {
            const { key } = req.params;
            if(!key || !CommonLib.isValidObjectId(key)){
                throw new UnprocessableEntityError("Invalid Category selected")
            }
            const result = await LearnWithKordieService.getByKey(key);
            if (!result) {
                throw new NotFoundError('Learn with kordie not found');
            }
            next(result);
        } catch (err) {
            next(err);
        }
    },


        // Get a LearnWithKordie by key
        async getById(req, res, next) {
            try {
                const { id } = req.params;
                const result = await LearnWithKordieService.getById(id);
                if (!result) {
                    throw new NotFoundError('Learn with kordie not found');
                }
                next(result);
            } catch (err) {
                next(err);
            }
        },

    // Update a LearnWithKordie by key
    update:[
        upload.fields([{ name: 'image', maxCount: 1 },{ name: 'icon', maxCount: 1 }]),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            let data = {
                // Required fields
                title: req.body.title,  // The title of the Crucial Skill Set
                key: StringLib.generateSlug(req.body.title),
                description: req.body.description,  // Optional description of the section
                category_id : req.body.category_id
            };

            if (req.files?.image) {
                const mediaFile = req.files.image[0];
                const uploadedMedia = await s3Service.uploadFile(mediaFile, 'image');
                data.image = uploadedMedia;
            }
            if (req.files?.icon) {
                const mediaFile = req.files.icon[0];
                const uploadedMedia = await s3Service.uploadFile(mediaFile, 'icon');
                data.icon = uploadedMedia;
            }

            const result = await LearnWithKordieService.update(id, data);
            if (!result) {
                throw new NotFoundError('Learn with kordie not found');
            }
            next(result);
        } catch (err) {
            next(err);
        }
    },
    ],

    // Delete a LearnWithKordie by key
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await LearnWithKordieService.delete(id);
            if (!result) {
                throw new NotFoundError('Learn with kordie not found');
            }
            next({ message: 'Learn with kordie deleted successfully' });
        } catch (err) {
            next(err);
        }
    },

    async toggleStatus(req, res, next) {
        try {
        const id = req.params.id;
        const toggle = await LearnWithKordieService.toggleStatus(id);
        next(toggle);
        } 
        catch(e) {
        next(e);
        }

      },

      async getAllTitlesAndKeys(req, res, next){
        try {
            const skillSets = await LearnWithKordieService.getAllTitlesAndKeys();
            next(skillSets);
        } catch (error) {
            next(error);
        }
    },
    
};

module.exports = LearnWithKordieController;
