const { NotFoundError } = require('../../../errors/http/http.errors');
const { CommonLib } = require('../../../lib');
const { ContactContent } = require('../db/models');


const ContactContentService = {
    // CREATE contactcontent
    async createContactContent(data) {
        const allowedTypes = ['General Enquiry', 'Request a Demo', 'Learning Partner', 'Media & Press', 'Sales Inquiry', 'Candidate Inquiry',];
        if (data.type && !allowedTypes.includes(data.type)) {
            throw new Error('Invalid type value');
        }
        const newContactContent = new ContactContent({
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            email: data.email,
            type: data.type,
        });

        const existing = await ContactContent.findOne({ type: newContactContent.type, is_deleted: false });
        if (existing) {
            throw new Error('This Contact Type Content already exists');
        }

        return newContactContent.save();
    },

    // GET ALL HIGHLIGHTS
async getAllContactContent({ page, limit, title, subtitle, active, sortBy }) {
        const query = { is_deleted: false };
        if (title) query.title = { $regex: new RegExp(title, 'i') };
    if (subtitle) query.subtitle = { $regex: new RegExp(subtitle, 'i') }; // Add subtitle search
    if (active) query.is_active = active === 'true'; 

        const sortOptions = {
            '1': { title: 1 },
            '2': { title: -1 },
            '3': { createdAt: 1 },
            '4': { createdAt: -1 },
        };

        const sort = sortOptions[sortBy] || { createdAt: -1 };

        const total = await ContactContent.countDocuments(query);

        let items;
        if (page && limit) {
            const offset = (page - 1) * limit;
            items = await ContactContent.find(query).sort(sort).skip(offset).limit(Number(limit));
        } else {
            items = await ContactContent.find(query).sort(sort);
        }
        pagination = CommonLib.getPagination(page, limit, total);
        return {
            items,
            pagination: page && limit ? pagination : null,
        };
    },

    // GET SINGLE contactcontent
    async getSingleContactContent(id) {
        const contactcontent = await ContactContent.findById(id);
        if (!contactcontent || contactcontent.is_deleted) {
            throw new NotFoundError('ContactContent not found');
        }
        return contactcontent;
    },


    // GET SINGLE ContactContent BY TYPE
    async getSingleContactContentType(type) {
        const contactcontent = await ContactContent.findOne({ type, is_deleted: false }); // Match type and ensure it's not deleted
        if (!contactcontent) {
            throw new Error('ContactContent not found');
        }
        return contactcontent;
    },


    // UPDATE contactcontent
    async updateContactContent(id, data) {
        const allowedTypes = ['General Enquiry', 'Request a Demo', 'Partnerships', 'Media & Press', 'Sales Inquiry', 'Candidate Inquiry'];
        if (data.type && !allowedTypes.includes(data.type)) {
            throw new Error('Invalid type value');
        }
        const existing = await ContactContent.findOne({ type: data.type, _id: { $ne: id }, is_deleted: false });
        if (existing) {
            throw new Error('This Contact Type Content already exists');
        }


        const contactcontent = await ContactContent.findByIdAndUpdate(
            id,
            {   
                title: data.title,
                subtitle: data.subtitle,
                description: data.description,
                email: data.email,
                type: data.type 
            },
            { new: true }
        );

        if (!contactcontent) {
            throw new NotFoundError('ContactContent not found');
        }

        return contactcontent;
    },

    // DELETE contactcontent
    async deleteContactContent(id) {
        const contactcontent = await ContactContent.findById(id);
        if (!contactcontent || contactcontent.is_deleted) {
            throw new NotFoundError('ContactContent not found');
        }
        await ContactContent.findByIdAndDelete(id);
        return { message: 'Learning Track deleted successfully', contactcontent };
        // contactcontent.is_deleted = true;
        // return contactcontent.save();
    },

    // TOGGLE STATUS
    async toggleStatus(id) {
        const contactcontent = await ContactContent.findById(id);
        if (!contactcontent || contactcontent.is_deleted) {
            throw new NotFoundError('ContactContent not found');
        }

        contactcontent.is_active = !contactcontent.is_active;
        return contactcontent.save();
    },
};

module.exports = ContactContentService;
