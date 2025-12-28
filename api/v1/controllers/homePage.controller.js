const homeService = require('../services/homePage.service');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

const homePageController = {
    /**Why Learn with Kordie............................................... */

    /**Create Learn Kordie Content */
    createLearnKordieContent: [
        upload.fields([
            { name: 'media', maxCount: 1 },
            { name: 'icon', maxCount: 1 }
        ]), 
        async (req, res) => {
            try {
                const videoFile = req.files?.media?.[0];
                const iconFile = req.files?.icon?.[0];
                const learningContent = await homeService.createLearnKordieContent(req.body, videoFile,iconFile);

                if (learningContent?.status === 400) {
                    return res.status(learningContent.status).json({ success: false, message: learningContent.error_message });
                }
                else{
                    res.status(201).json({ success: true, message: 'Data created successfully', data: learningContent });
                }

            } catch (error) {
                res.status(400).json({ success: false, message: 'Error creating content', error });
                throw error;
            }
        }
    ],

    /**View Learn Kordie all Content */
    getAllLearnKordieContent:[
        async (req, res) => {
            try {
                const contentList = await homeService.getAllLearnKordieContent({
                    page: parseInt(req.query.page) || 0,
                    limit: parseInt(req.query.limit) || 0,
                    title: req.query.title,
                    active: req.query.active,
                    sortby: req.query.sortBy,
                });
                res.status(200).json({ success: true, data: contentList });
            } catch (error) {
                res.status(400).json({ success: false, message: 'Error fetching content', error });
                throw error;
            }
        }
    ],



     /** Update Learn Kordie Content */
     updateLearnKordieContent: [
        upload.fields([{ name: 'media', maxCount: 1 }, { name: 'icon', maxCount: 1 }]),
        async (req, res) => {
            try {
                const contentId = req.params.id; 
                const videoFile = req.files?.media?.[0];
                const iconFile = req.files?.icon?.[0];
                const updatedContent = await homeService.updateLearnKordieContent(contentId, req.body, videoFile, iconFile);

                if (updatedContent?.status === 404) {
                    return res.status(updatedContent.status).json({ success: false, message: updatedContent.error_message });
                }

                res.status(200).json({ success: true, message: 'Data updated successfully', data: updatedContent });
            } catch (error) {
                res.status(400).json({ success: false, message: 'Error updating content', error });
                throw error;
            }
        }
    ],

    /** Delete Learn Kordie Content */
    deleteLearnKordieContent:[
        async (req, res) => {
            try {
                const contentId = req.params.id;
                const deleteResponse = await homeService.deleteLearnKordieContent(contentId);
    
                if (deleteResponse.status === 404) {
                    return res.status(deleteResponse.status).json({ success: false, message: deleteResponse.error_message });
                }
    
                res.status(200).json({ success: true, message: deleteResponse.message });
            } catch (error) {
                res.status(400).json({ success: false, message: 'Error deleting content', error });
                throw error;
            }
        }
    ],

    /** View Learn Kordie Content by ID */
    getLearnKordieContentById:[
        async (req, res) => {
            try {
                const contentId = req.params.id; 
                const content = await homeService.getLearnKordieContentById(contentId);
    
                if (content?.status === 404) {
                    return res.status(content.status).json({ success: false, message: content.error_message });
                }
    
                res.status(200).json({ success: true, data: content });
            } catch (error) {
                res.status(400).json({ success: false, message: 'Error fetching content', error });
                throw error;
            }
        }
    ],


    /**Meet your Curators.................................................... */

    /**Create Meet your Curators Content */
    createMeetCuatorsContent: [
        upload.fields([
            { name: 'image', maxCount: 1 }
        ]), 
        async (req, res) => {
            try {
                const imageFile = req.files?.image?.[0];
                const curatorsContent = await homeService.createMeetCuatorsContent(req.body, imageFile);

                if (curatorsContent?.status === 400) {
                    return res.status(curatorsContent.status).json({ success: false, message: curatorsContent.error_message });
                }
                else{
                    res.status(201).json({ success: true, message: 'Data created successfully', data: curatorsContent });
                }

            } catch (error) {
                res.status(400).json({ success: false, message: 'Error creating content', error });
                throw error;
            }
        }
    ],

    /**View  Meet your Curators all Contents */
    getAllMeetCuatorsContent:[
        async (req, res) => {
            try {
                const curatorsContentList = await homeService.getAllMeetCuatorsContent({
                    page: parseInt(req.query.page) || 0,
                    limit: parseInt(req.query.limit) || 0,
                    name: req.query.name,
                    active: req.query.active,
                    sortby: req.query.sortBy,
                });
                res.status(200).json({ success: true, data: curatorsContentList });
            } catch (error) {
                res.status(400).json({ success: false, message: 'Error fetching content', error });
                throw error;
            }
        }
    ],

    /** Update Meet your Curators Content */
    updateMeetCuatorsContent: [
        upload.fields([{ name: 'image', maxCount: 1 }]),
        async (req, res) => {
            try {
                const curatorsContentId = req.params.id; 
                const imageFile = req.files?.image?.[0];
                const updatedCuratorsContent = await homeService.updateMeetCuatorsContent(curatorsContentId, req.body, imageFile);

                if (updatedCuratorsContent?.status === 404) {
                    return res.status(updatedCuratorsContent.status).json({ success: false, message: updatedCuratorsContent.error_message });
                }

                res.status(200).json({ success: true, message: 'Data updated successfully', data: updatedCuratorsContent });

            } catch (error) {
                res.status(400).json({ success: false, message: 'Error updating content', error });
                throw error;
            }
        }
    ],

    /** Delete Meet your Curators Content */
    deleteMeetCuatorsContent:[
        async (req, res) => {
            try {
                const contentId = req.params.id;
                const deleteResponse = await homeService.deleteMeetCuatorsContent(contentId);
    
                if (deleteResponse.status === 404) {
                    return res.status(deleteResponse.status).json({ success: false, message: deleteResponse.error_message });
                }
    
                res.status(200).json({ success: true, message: deleteResponse.message });
            } catch (error) {
                res.status(400).json({ success: false, message: 'Error deleting content', error });
                throw error;
            }
        }
    ],

    /** View Meet your Curators Content by ID */
    getMeetCuatorsContentById:[
        async (req, res) => {
            try {
                const contentId = req.params.id; 
                const content = await homeService.getMeetCuatorsContentById(contentId);
    
                if (content?.status === 404) {
                    return res.status(content.status).json({ success: false, message: content.error_message });
                }
    
                res.status(200).json({ success: true, data: content });
            } catch (error) {
                res.status(400).json({ success: false, message: 'Error fetching content', error });
                throw error;
            }
        }
    ],



    /**Students Speaks for Us.................................................... */

    /**Create Students Speaks for Us Content */
    createStudentsSpeaksForUsContent: [
        upload.fields([
            { name: 'image', maxCount: 1 }
        ]), 
        async (req, res) => {
            try {
                const studentImageFile = req.files?.image?.[0];
                const studentsContent = await homeService.createStudentsSpeaksForUsContent(req.body, studentImageFile);

                if (studentsContent?.status === 400) {
                    return res.status(studentsContent.status).json({ success: false, message: studentsContent.error_message });
                }
                else{
                    res.status(201).json({ success: true, message: 'Data created successfully', data: studentsContent });
                }

            } catch (error) {
                res.status(400).json({ success: false, message: 'Error creating content', error });
                throw error;
            }
        }
    ],

    /**View Students Speaks for Us Contents */
     getAllStudentsSpeaksForUsContent:[
        async (req, res) => {
            try {
                const StudentsContentList = await homeService.getAllStudentsSpeaksForUsContent();
                res.status(200).json({ success: true, data: StudentsContentList });
            } catch (error) {
                res.status(400).json({ success: false, message: 'Error fetching content', error });
                throw error;
            }
        }
    ],

     /** View Students Speaks for Us Content by ID */
     getAllStudentsSpeaksForUsContentById:[
        async (req, res) => {
            try {
                const contentId = req.params.id; 
                const content = await homeService.getAllStudentsSpeaksForUsContentById(contentId);
    
                if (content?.status === 404) {
                    return res.status(content.status).json({ success: false, message: content.error_message });
                }
    
                res.status(200).json({ success: true, data: content });
            } catch (error) {
                res.status(400).json({ success: false, message: 'Error fetching content', error });
                throw error;
            }
        }
    ],

    /** Update  Students Speaks for Us Content */
    updateStudentsSpeaksForUsContent: [
        upload.fields([{ name: 'image', maxCount: 1 }]),
        async (req, res) => {
            try {
                const contentId = req.params.id; 
                const imageFile = req.files?.image?.[0];
                const updatedContent = await homeService.updateStudentsSpeaksForUsContent(contentId, req.body, imageFile);

                if (updatedContent?.status === 404) {
                    return res.status(updatedContent.status).json({ success: false, message: updatedContent.error_message });
                }

                res.status(200).json({ success: true, message: 'Data updated successfully', data: updatedContent });

            } catch (error) {
                res.status(400).json({ success: false, message: 'Error updating content', error });
                throw error;
            }
        }
    ],

    /** Delete Students Speaks for Us Content */
    deleteStudentsSpeaksForUsContent:[
        async (req, res) => {
            try {
                const contentId = req.params.id;
                const deleteResponse = await homeService.deleteStudentsSpeaksForUsContent(contentId);
    
                if (deleteResponse.status === 404) {
                    return res.status(deleteResponse.status).json({ success: false, message: deleteResponse.error_message });
                }
    
                res.status(200).json({ success: true, message: deleteResponse.message });
            } catch (error) {
                res.status(400).json({ success: false, message: 'Error deleting content', error });
                throw error;
            }
        }
    ],
}

module.exports = homePageController;