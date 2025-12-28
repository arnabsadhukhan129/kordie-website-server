const {TitleService} = require('../services');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const TitleController = {

    // CREATE A TITLE
    createTitle:[
    upload.fields([{ name: 'image', maxCount: 1 },{ name: 'video', maxCount: 1 }]),
    async (req,res,next)=>{
        try{
            let data = req.body;
            const imageFile = req.files?.image?.[0];
            const videoFile = req.files?.video?.[0];
            const title = await TitleService.createTitle(data, imageFile, videoFile);
            next(title);
        }
        catch(err){
            next(err);
        }
    },
    ],

    // GET ALL TITLE
    async getAllTitles(req,res,next){
        try{        
            //console.log(req.query.active,"oooooooooooooooooooooooooo");  
            const titleList = await TitleService.getTitles({
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 0,
                name: req.query.name,
                active: req.query.active,
                sortby: req.query.sortBy,
            });
            next(titleList);
        }
        catch(err){
            next(err);
        }
    },

    // DELETE TITLE
    async deleteTitle(req,res,next){
        try{
            //const {id} = req.body;
            const titleList = await TitleService.deleteTitle(req.params.id);
            next(titleList);
        }
        catch(err){
            next(err);
        }
    },

    // UPDATE TITLE
    updateTitle:[
    upload.fields([{ name: 'image', maxCount: 1 },{ name: 'video', maxCount: 1 }]),
    async (req,res,next)=>{
        try{
            
            const data = req.body;
            const imageFile = req.files?.image?.[0];
            const videoFile = req.files?.video?.[0];
            const title = await TitleService.updateTitle(req.params.id,data,imageFile,videoFile);
            next(title);
        }
        catch(err){
            next(err);
        }
    },
    ],

    //GET ONE TITLE
    async getSingleTitle(req,res,next){
        try{
            //console.log("Controller executed--------------", req.query, req.params);
            const {id} = req.params;
            const title = await TitleService.getTitleById(id);
            next(title);
        }
        catch(err){
            next(err);
        }
    },
    async toggleStatus(req, res, next) {
        try {
        const toggleId = req.params.id;
        const toggle = await TitleService.toggleStatus(toggleId);
        next(toggle);
        } 
        catch(e) {
        next(e);
        }
    },
    async toggleShow(req, res, next) {
        try {
        const toggleId = req.params.id;
        const toggle = await TitleService.toggleShow(toggleId);
        next(toggle);
        } 
        catch(e) {
        next(e);
        }
    },
};

module.exports = TitleController;