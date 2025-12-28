const { ContactBannerService } = require('../services');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const ContactBannerController = {
  // CREATE CONTACT BANNER
  createContactBanner:[
  upload.fields([{ name: 'image', maxCount: 1 }]),
  async (req, res, next) => {
    try {
      const imageFile = req.files?.image?.[0];
      const result = await ContactBannerService.createContactBanner(req.body, imageFile);
      next({ message: 'Contact Banner created successfully', result });
    } catch (error) {
      next(error);
    }
  },
 ],

  // GET ALL CONTACT BANNERS
  async getAllContactBanners(req, res, next) {
    try {
      const { page, limit, title, active, sortBy } = req.query;
      const result = await ContactBannerService.getAllContactBanners({ page, limit, title, active, sortBy });
      next(result);
    } catch (error) {
      next(error);
    }
  },

  // GET SINGLE CONTACT BANNER
  async getSingleContactBanner(req, res, next) {
    try {
      const result = await ContactBannerService.getSingleContactBanner(req.params.id);
      next(result);
    } catch (error) {
      next(error);
    }
  },

  // UPDATE CONTACT BANNER
  updateContactBanner:[
  upload.fields([{ name: 'image', maxCount: 1 }]),
  async (req, res, next) => {
    try {
      const imageFile = req.files?.image?.[0];
      const result = await ContactBannerService.updateContactBanner(req.params.id, req.body, imageFile);
      next({ message: 'Contact Banner updated successfully', result });
    } catch (error) {
      next(error);
    }
  },
  ],

  // DELETE CONTACT BANNER
  async deleteContactBanner(req, res, next) {
    try {
      const result = await ContactBannerService.deleteContactBanner(req.params.id);
      next({ message: 'Contact Banner deleted successfully', result });
    } catch (error) {
      next(error);
    }
  },

  // TOGGLE ACTIVE STATUS
  async toggleStatus(req, res, next) {
    try {
      const result = await ContactBannerService.toggleStatus(req.params.id);
      next({ message: 'Status toggled successfully', result });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ContactBannerController;
