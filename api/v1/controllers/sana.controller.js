const {SanaService} = require('../services');
const SanaController = {
    async createSana(req,res,next){
        try{
            const sana = await SanaService.createSana(req.body);
            next(sana);
        }
        catch(err){
            next(err);
        }
    },

    async getSanaCourses(req,res,next){
        try{
            const sana = await SanaService.getSanaCourses();
            next(sana);
        }
        catch(err){
            next(err);
        }
    },

    async getSanaAllCourses(req,res,next){
        try{
            // Extract limit and next from query parameters
        const { limit = 1000, next: nextToken = null } = req.query;

        // Call the service function with the extracted parameters
        const sanaCourses = await SanaService.getSanaAllCourses(Number(limit), nextToken);
            next(sanaCourses);
        }
        catch(err){
            next(err);
        }
    },

    async getSanaSingleCourse(req, res, next) {
        try {
            // Extract the course ID from the request parameters
            const { id } = req.params;
    
            // Call the service function with the course ID
            const course = await SanaService.getSanaSingleCourse(id);
            next(course); // Send the course details as the response
        } catch (err) {
            console.error('Error fetching single course:', err.message);
            next(err); // Pass the error to the error handler
        }
    }
    
 
};

module.exports = SanaController;