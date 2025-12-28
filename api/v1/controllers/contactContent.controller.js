const { ContactContentService } = require('../services');
const ContactContentController = {
    // CREATE HIGHLIGHT
    async createContactContent(req, res, next) {
        try {
            const result = await ContactContentService.createContactContent(req.body);
            next({ message: 'ContactContent created successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // GET ALL HIGHLIGHTS
    async getAllContactContents(req, res, next) {
        // Add subtitle to query parameters
        try {
            const { page, limit, title, active, sortBy, subtitle } = req.query;;
            const result = await ContactContentService.getAllContactContent({ page, limit, title, active, sortBy,subtitle });
            next(result);
        } catch (error) {
            next(error);
        }
    },

    // GET SINGLE HIGHLIGHT
    async getSingleContactContent(req, res, next) {
        try {
            const result = await ContactContentService.getSingleContactContent(req.params.id);
            next(result);
        } catch (error) {
            next(error);
        }
    },


        // GET SINGLE HIGHLIGHT
        async getSingleContactContentType(req, res, next) {
            try {
                const result = await ContactContentService.getSingleContactContentType(req.params.type);
                next(result);
            } catch (error) {
                next(error);
            }
        },

    // UPDATE HIGHLIGHT
    async updateContactContent(req, res, next) {
        try {
            const result = await ContactContentService.updateContactContent(req.params.id, req.body);
            next({ message: 'ContactContent updated successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // DELETE HIGHLIGHT
    async deleteContactContent(req, res, next) {
        try {
            const result = await ContactContentService.deleteContactContent(req.params.id);
            next({ message: 'ContactContent deleted successfully', result });
        } catch (error) {
            next(error);
        }
    },

    // TOGGLE STATUS
    async toggleStatus(req, res, next) {
        try {
            const result = await ContactContentService.toggleStatus(req.params.id);
            next({ message: 'Status toggled successfully', result });
        } catch (error) {
            next(error);
        }
    },


    async contactDropdown(req, res, next){
        try {
            const asp =  ['General Enquiry', 'Request a Demo', 'Partnerships', 'Media & Press', 'Sales Inquiry', 'Candidate Inquiry'];
            next(asp);
       
        } catch(e) {
            next(e);
        }

    },
};

module.exports = ContactContentController;
