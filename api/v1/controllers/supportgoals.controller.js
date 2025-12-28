const { SupportGoalsService } = require('../services');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const SupportGoalsController = {
    createSupportGoals: [
        upload.fields([{ name: 'image', maxCount: 1 }]),
        async (req, res, next) => {
            try {
                const imageFile = req.files?.image?.[0];
                const supportGoalsData = await SupportGoalsService.createSupportGoals(req.body, imageFile);
                next({ message: 'Support Goal created successfully', supportGoalsData });
            } catch (error) {
                next(error);
            }
        },
    ],

    deleteSupportGoals: [
        async (req, res, next) => {
            try {
                const supportGoalId = req.params.id;
                const deletedSupportGoal = await SupportGoalsService.deleteSupportGoals(supportGoalId);
                next({ message: 'Support Goal deleted successfully', deletedSupportGoal });
            } catch (error) {
                next(error);
            }
        },
    ],

    editSupportGoals: [
        upload.fields([{ name: 'image', maxCount: 1 }]),
        async (req, res, next) => {
            try {
                const imageFile = req.files?.image?.[0];
                const supportGoalId = req.params.id;
                const updatedData = await SupportGoalsService.editSupportGoals(supportGoalId, req.body, imageFile);
                next({ message: 'Support Goal updated successfully', updatedData });
            } catch (error) {
                next(error);
            }
        },
    ],

    viewSupportGoals: [
        async (req, res, next) => {
            try {
                const supportGoal = await SupportGoalsService.viewSupportGoals();
                next({ supportGoal });
            } catch (error) {
                next(error);
            }
        },
    ],

    viewSupportGoalsId: [
        async (req, res, next) => {
            try {
                const supportGoalId = req.params.id;
                const supportGoal = await SupportGoalsService.viewSupportGoalsId(supportGoalId);
                next({ supportGoal });
            } catch (error) {
                next(error);
            }
        },
    ],



        // GET ALL TITLE
        async listSupportGoals(req,res,next){
            try{        
                //console.log(req.query.active,"oooooooooooooooooooooooooo");  
                const supportGoals = await SupportGoalsService.listSupportGoals({
                    page: parseInt(req.query.page) || 0,
                    limit: parseInt(req.query.limit) || 0,
                    title: req.query.title,
                    active: req.query.active,
                    sortby: req.query.sortBy,
                });
                next(supportGoals);
            }
            catch(err){
                next(err);
            }
        },
};

module.exports = SupportGoalsController;
