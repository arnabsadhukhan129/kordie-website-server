const { NotFoundError } = require('../../../errors/http/http.errors');
const { ContactBanner } = require('../db/models');
const s3Service = require('./s3.service'); 
const { CommonLib } = require('../../../lib');
const ContactBannerService = {
// CREATE CONTACT BANNER
async createContactBanner(data, file) {
    if (file) {
      const imageUrl = await s3Service.uploadFile(file, 'images');
      data.image = imageUrl;
    }
  
    const stats = data.stats
      ? Array.isArray(data.stats)
        ? data.stats
        : JSON.parse(data.stats)
      : []; // Default to an empty array if `data.stats` is not provided
  
    const newBanner = new ContactBanner({
      title: data.title,
      description: data.description,
      image: data.image,
      stats: stats,
    });
  
    return newBanner.save();
  },
  

  // GET ALL CONTACT BANNERS WITH PAGINATION
  async getAllContactBanners({ page, limit, title, active, sortBy }) {
    const query = { is_deleted: false };
    if (title) query.title = { $regex: new RegExp(title, 'i') };
    if (active) query.is_active = active === 'true';

    const sortOptions = {
      '1': { title: 1 },
      '2': { title: -1 },
      '3': { createdAt: 1 },
      '4': { createdAt: -1 },
    };

    const sort = sortOptions[sortBy] || { createdAt: -1 };

    const total = await ContactBanner.countDocuments(query);
    let items;

    if (page && limit) {
      const offset = (page - 1) * limit;
      items = await ContactBanner.find(query).sort(sort).skip(offset).limit(Number(limit));
    } else {
      items = await ContactBanner.find(query).sort(sort);
    }
    pagination = CommonLib.getPagination(page, limit, total);
    return {
      items,
      pagination: page && limit ? pagination : null,
    };
  },

  // GET SINGLE CONTACT BANNER
  async getSingleContactBanner(id) {
    const banner = await ContactBanner.findById(id);
    if (!banner || banner.is_deleted) {
      throw new NotFoundError('Contact Banner not found');
    }
    return banner;
  },

  // UPDATE CONTACT BANNER
  async updateContactBanner(id, data, file) {
    if (file) {
        const imageUrl = await s3Service.uploadFile(file, 'images');
        data.image = imageUrl;
    }
    const updatedFields = {
        title: data.title,
        description: data.description,
        image: data.image,
      };
    
      // Safely handle stats
      if (data.stats) {
        updatedFields.stats = Array.isArray(data.stats)
          ? data.stats
          : JSON.parse(data.stats);
      }
    
      const banner = await ContactBanner.findByIdAndUpdate(
        id,
        updatedFields,
        { new: true }
      );

    if (!banner) {
      throw new NotFoundError('Contact Banner not found');
    }

    return banner;
  },

  // DELETE CONTACT BANNER (HARD DELETE)
  async deleteContactBanner(id) {
    const banner = await ContactBanner.findById(id);
  
    if (!banner) {
      throw new NotFoundError('Contact Banner not found');
    }
  
    // Perform a hard delete
    await ContactBanner.findByIdAndDelete(id);
  
    return { message: 'Contact Banner deleted successfully', banner };
  },
  

  // TOGGLE ACTIVE STATUS
  async toggleStatus(id) {
    const banner = await ContactBanner.findById(id);
    if (!banner || banner.is_deleted) {
      throw new NotFoundError('Contact Banner not found');
    }

    banner.is_active = !banner.is_active;
    return banner.save();
  },
};

module.exports = ContactBannerService;
