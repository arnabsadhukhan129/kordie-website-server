const {HospitalityService} = require('../services');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });
const HospitalityController = {
    // Create Hospitality
    createHospitality: [
        upload.fields([{ name: 'media', maxCount: 1 }]), // Image upload handling
        async (req, res, next) => {
            try {
                const imageFile = req.files?.media?.[0];
                const hospitalityData = await HospitalityService.createHospitality(req.body, imageFile);
                next({message: 'Hospitality created successfully', hospitalityData });
            } catch (error) {
                next(error);
            }
        }
    ],

    // Delete Hospitality
    deleteHospitality: [
        async (req, res, next) => {
            try {
                const hospitalityId = req.params.id;
                const deletedHospitality = await HospitalityService.deleteHospitality(hospitalityId);
                next({ message: 'Hospitality deleted successfully', deletedHospitality });
            } catch (error) {
                next(error);
            }
        }
    ],

    // Edit Hospitality
    editHospitality: [
        upload.fields([{ name: 'media', maxCount: 1 }]),
        async (req, res, next) => {
            try {
                const imageFile = req.files?.media?.[0];
                const hospitalityId = req.params.id;
                const updatedData = await HospitalityService.editHospitality(hospitalityId, req.body, imageFile);
                next({ message: 'Hospitality updated successfully', updatedData });
            } catch (error) {
                next(error);
            }
        }
    ],

    // View Hospitality by ID
    viewHospitality: [
        async (req, res,next) => {
            try {
                //const hospitalityId = req.params.id;
                const hospitality = await HospitalityService.viewHospitality();
                next({hospitality });
            } catch (error) {
                next(error);
            }
        }
    ],

        // View Hospitality by ID
        viewHospitalityId: [
            async (req, res,next) => {
                try {
                    const hospitalityId = req.params.id;
                    const hospitality = await HospitalityService.viewHospitalityId(hospitalityId);
                    next({hospitality });
                } catch (error) {
                    next(error);
                }
            }
        ],



// GET ALL TITLE
        async listHospitality(req,res,next){
            try{        
                //console.log(req.query.active,"oooooooooooooooooooooooooo");  
                const hospitality = await HospitalityService.listHospitality({
                    page: parseInt(req.query.page) || 0,
                    limit: parseInt(req.query.limit) || 0,
                    title: req.query.title,
                    active: req.query.active,
                    sortby: req.query.sortBy,
                });
                next(hospitality);
            }
            catch(err){
                next(err);
            }
        },
};

module.exports = HospitalityController;