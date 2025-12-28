const { FocusedService } = require('../services');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });
const FocusController = {
    // Create Focused
    createFocused: [
        
        async (req, res, next) => {
            try {
                const focusedData = await FocusedService.createFocused(req.body);
                next({message: 'Logo created successfully', focusedData });
            } catch (error) {
                next(error);
            }
        }
    ],

    // Delete Focused
    deleteFocused: [
        async (req, res, next) => {
            try {
                const focusedId = req.params.id;
                const deletedFocused = await FocusedService.deleteFocused(focusedId);
                next({ message: 'Logo deleted successfully', deletedFocused });
            } catch (error) {
                next(error);
            }
        }
    ],

    // Edit Focused
    editFocused: [
      
        async (req, res, next) => {
            try {
                const focusedId = req.params.id;
                const updatedData = await FocusedService.editFocused(focusedId, req.body);
                next({ message: 'Logo updated successfully', updatedData });
            } catch (error) {
                next(error);
            }
        }
    ],

    // View Focused by ID
    viewFocused: [
        async (req, res,next) => {
            try {
                const focusedId = req.params.id;
                const focused = await FocusedService.viewFocused(focusedId);
                next({focused });
            } catch (error) {
                next(error);
            }
        }
    ],



        // GET ALL TITLE
        async listFocused(req,res,next){
            try{        
                const focused = await FocusedService.listFocused({
                    page: parseInt(req.query.page) || 0,
                    limit: parseInt(req.query.limit) || 0,
                    title: req.query.title,
                    active: req.query.active,
                    sortby: req.query.sortBy,
                });
                next(focused);
            }
            catch(err){
                next(err);
            }
        },

    
};

module.exports = FocusController;