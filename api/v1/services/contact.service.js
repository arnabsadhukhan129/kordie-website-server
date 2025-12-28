const { default: mongoose } = require('mongoose');
const AppConfig = require('../../../config/app.config');
const { NotFoundError } = require('../../../errors/http/http.errors');
const { CommonLib } = require('../../../lib');
const { Contact } = require('../db/models');
const s3Service = require('./s3.service'); 

const ContactService = {

    async createContact(data) {

        const contactdata = {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            jobtitle: data.jobtitle,
            country: data.country,
            company: data.company,
            linkedin: data.linkedin,
            type: data.type,
            message: data.message,
            businessType: data.businessType,
            teamSize: data.teamSize,
            requestServices: data.requestServices,
            attachCV: data.attachCV,
            phone: data.phone,
            countryCode: data.countryCode,
            
        };

        try {
            const newContact = await Contact.create(contactdata);
            return { message: 'Contact created successfully', newContact };
        } catch (error) {
            // Handle the error if the creation fails
            return { message: 'Error creating Contact', data: error };
        }
    },

    async uploadcv(file) {
        
        const allowedTypes = [
          "application/pdf",
          "application/x-pdf", 
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
      
        if (!file) {
          return { message: "No file provided.", error: true };
        }
      
        // console.log("File mimetype:", file.mimetype);
      
        const isAllowedMimeType = file.mimetype ? allowedTypes.includes(file.mimetype) : false;
      
        
        let isAllowedExtension = false;
        if (file.originalname) {
          const fileName = file.originalname.toLowerCase();
          isAllowedExtension =
            fileName.endsWith(".pdf") ||
            fileName.endsWith(".doc") ||
            fileName.endsWith(".docx");
        }
      
        if (!isAllowedMimeType && !isAllowedExtension) {
          return { message: "Only DOC or PDF files are allowed.", error: true };
        }
      
        try {
          const mediaUrl = await s3Service.uploadFileOne(file, 'media');
          return { message: 'Media uploaded successfully', mediaUrl };
        } catch (error) {
          return { message: 'Error creating Upload', data: error };
        }
      },



    async getContact({ page, limit, searchQuery, active, sortby }) {
        const aggregate = { is_deleted: false };
        let contact = [];
        let offset;
        let total = null; // Initialize total as null
        let pagination = null;

        let sort = {};
        // Implement a switch-case statement
        switch (sortby) {
            case '1':
                sort = { firstname: 1 }
                break;
            case '2':
                sort = { firstname: -1 }
                break;
            case '3':
                sort = { createdAt: 1 }
                break;
            case '4':
                sort = { createdAt: -1 }
                break;
            default:
                sort = { createdAt: -1 }
        }

        if (page && limit) {
            offset = CommonLib.getOffset(page, limit);
            const query = aggregate;
            if (searchQuery) {
                query.$or = [
                    { email: { $regex: new RegExp(searchQuery, 'i') } }, // Case-insensitive email search
                    {
                        $or: [
                            { firstname: { $regex: new RegExp(searchQuery, 'i') } },
                        ]
                    }
                ];
            }


            // Calculate the total count based on the query
            total = await Contact.countDocuments(query);

            // Calculate pagination
            pagination = CommonLib.getPagination(page, limit, total);

            // Retrieve users with pagination and type filter
            contact = await Contact.find(query)
                .sort(sort)
                .skip(offset)
                .limit(limit)
                ;
        } else {
            const query = aggregate;
            if (searchQuery) {
                query.$or = [
                    { email: { $regex: new RegExp(searchQuery, 'i') } }, // Case-insensitive email search
                    {
                        $or: [
                            { firstname: { $regex: new RegExp(searchQuery, 'i') } },
                        ]
                    }
                ];
            }


            // Calculate the total count based on the query
            total = await Contact.countDocuments(query);

            // Retrieve users with or without type filter
            contact = await Contact.find(query).sort(sort);
        }

        // Now you have the total count and pagination based on the 'type' variable.
        return { contact, pagination };
    },

    async getById(id) {
        try {
            const csview = await Contact.findById(id);
            if (!csview) {
                throw new NotFoundError('Contact not found');
            }
            return csview;
        } catch (error) {
            throw error; // propagate the error upwards
        }
    },



        // DELETE contactcontent
        async deleteContact(id) {
            const contact = await Contact.findById(id);
            if (!contact) {
                throw new NotFoundError('contact not found');
            }
            await Contact.findByIdAndDelete(id);
            return { message: 'Learning Track deleted successfully', contact };

        },


};

module.exports = ContactService;