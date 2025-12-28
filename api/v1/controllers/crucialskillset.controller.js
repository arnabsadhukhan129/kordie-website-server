const {CrucialSkillSetService} = require('../services');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { CommonLib, StringLib, envs } = require("../../../lib");
const {NotFoundError,UnprocessableEntityError} = require('../../../errors/http/http.errors');
const s3Service = require('../services/s3.service'); 
const CrucialSkillSetController = {
    // Create a new CrucialSkillSet
    create:[
    upload.fields([{ name: 'media', maxCount: 1 }]),
    async (req, res, next) => {
        try {
            let data = {
                // Required fields
                title: req.body.title,  // The title of the Crucial Skill Set
                key: StringLib.generateSlug(req.body.title),      // The unique key (used to uniquely identify the section)
                type: req.body.type,    // Type of media: "image" or "video"
                stats: Array.isArray(req.body.stats)
                ? req.body.stats
                : JSON.parse(req.body.stats),  
                // Optional fields
                heading: req.body.heading,  // Optional section heading
                description: req.body.description,  // Optional description of the section
                category_id : req.body.category_id,
                count:req.body.count, // Optional
            };

            if (req.files?.media) {
                const mediaFile = req.files.media[0];
                const uploadedMedia = await s3Service.uploadFile(mediaFile, 'media');
                data.media = uploadedMedia;
            }
            const result = await CrucialSkillSetService.create(data);
            next(result);
        } catch (err) {
            next(err);
        }
    },
   ],

    
    async getAll(req, res, next) {
        try {
            const result = await CrucialSkillSetService.getAll({
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
   

    // Get a CrucialSkillSet by key
    async getByKey(req, res, next) {
        try {
            const { key } = req.params;
            const result = await CrucialSkillSetService.getByKey(key);
            if (!result) {
                throw new NotFoundError('CrucialSkillSet not found');
            }
            next(result);
        } catch (err) {
            next(err);
        }
    },

    // Update a CrucialSkillSet by key
    update:[
        upload.fields([{ name: 'media', maxCount: 1 }]),
    async (req, res, next) => {
        try {
            const { key: _id } = req.params;
            let stats;
            if (req.body.stats) {
              stats = typeof req.body.stats === 'string'
                ? JSON.parse(req.body.stats)
                : req.body.stats;
            }
            let data = {
                // Required fields
                title: req.body.title,  // The title of the Crucial Skill Set
                // key: StringLib.generateSlug(req.body.title),     // The unique key (used to uniquely identify the section)
                type: req.body.type,    // Type of media: "image" or "video"
                // stats: (req.body.stats)
                // ? req.body.stats
                // : JSON.parse(req.body.stats),  
                stats: stats,           

            
                // Optional fields
                heading: req.body.heading,  // Optional section heading
                description: req.body.description,  // Optional description of the section
                category_id : req.body.category_id,
                count:req.body.count, // Optional

            };
            console.log(req.params,"PRAMS=========================")
            if (req.files?.media) {
                const mediaFile = req.files.media[0];
                const uploadedMedia = await s3Service.uploadFile(mediaFile, 'media');
                data.media = uploadedMedia;
            }

            const result = await CrucialSkillSetService.update(_id, data);
            if (!result) {
                throw new NotFoundError('CrucialSkillSet not found');
            }
            next(result);
        } catch (err) {
            next(err);
        }
    },
    ],

    // Delete a CrucialSkillSet by key
    async delete(req, res, next) {
        try {
            const { key:_id } = req.params;
            const result = await CrucialSkillSetService.delete(_id);
            if (!result) {
                throw new NotFoundError('CrucialSkillSet not found');
            }
            next({ message: 'Crucial SkillSet deleted successfully' });
        } catch (err) {
            next(err);
        }
    },

    async toggleStatus(req, res, next) {
        try {
        const toggleId = req.params.key;
        const toggle = await CrucialSkillSetService.toggleStatus(toggleId);
        next(toggle);
        } 
        catch(e) {
        next(e);
        }

      },

      async getAllTitlesAndKeys(req, res, next){
        try {
            const skillSets = await CrucialSkillSetService.getAllTitlesAndKeys();
            next(skillSets);
        } catch (error) {
            next(error);
        }
    },
    
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const result = await CrucialSkillSetService.getById(id);
            if (!result) {
                throw new NotFoundError('Learn with kordie not found');
            }
            next(result);
        } catch (err) {
            next(err);
        }
    },

};

module.exports = CrucialSkillSetController;
