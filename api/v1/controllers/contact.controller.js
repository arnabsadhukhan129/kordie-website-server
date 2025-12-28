const { now } = require("mongoose");
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory

const { NotFoundError } = require("../../../errors/http/http.errors");
const { envs,StringLib } = require("../../../lib");
const {ContactService,NotificationService} = require("../services");
const { User } = require('../db/models');
const upload = multer({ storage });

const ContactController = {
    async createContact(req, res, next) {
        try {
            const contact = await ContactService.createContact({...req.body});

            const adminUser = await User.findOne({
                user_type: { $in: ['admin'] }, 
              });
          
              if (adminUser.notify_email) {
                NotificationService.sendNotification(adminUser.notify_email, 
                    {type:req.body.type, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, jobtitle: req.body.jobtitle, country: req.body.country , company: req.body.company,
                        linkedin: req.body.linkedin, message: req.body.message}, 'contact_admin').then(r =>{console.log(r, "Contact Us mail send");}).catch(e => {console.log(e, "Contact Us mail error");});
              } 
            NotificationService.sendNotification(req.body.email, 
                {type:req.body.type, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, jobtitle: req.body.jobtitle, country: req.body.country , company: req.body.company,
                    linkedin: req.body.linkedin, message: req.body.message}, 'contact_us').then(r =>{console.log(r, "Contact Us mail send");}).catch(e => {console.log(e, "Contact Us mail error");});
            next(contact);
        } catch(e) {
            next(e);
        }
    },

      uploadcv:[
            upload.fields([{ name: 'media', maxCount: 1 }]),
            async (req,res,next)=>{
                try{
                    const media = req.files?.media?.[0];
                    const file = await ContactService.uploadcv(media);
                    next(file);
                }
                catch(err){
                    next(err);
                }
            },
        ],

    async contactDropdown(req, res, next){
        try {
            const asp =  ['General Enquiry', 'Request a Demo', 'Learning Partner', 'Media & Press', 'Sales Inquiry', 'Candidate Inquiry'];
            next(asp);
       
        } catch(e) {
            next(e);
        }

    },


    // GET ALL 
    async getAllContact(req,res,next){
        try{        
           const contactList = await ContactService.getContact({
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 0,
                searchQuery: req.query.keyword,
                sortby: req.query.sortBy,
            });
            next(contactList);
        }
        catch(err){
            next(err);
        }
    },

    async getCon(req, res, next) {
        try {
        const conview = await ContactService.getById(req.params.id);
            next(conview);
        } catch (error) {
            next(error);
        }
    },



    // DELETE HIGHLIGHT
    async deleteContact(req, res, next) {
        try {
            const result = await ContactService.deleteContact(req.params.id);
            next({ message: 'Contact deleted successfully', result });
        } catch (error) {
            next(error);
        }
    },
   
   
};

module.exports = ContactController;