const { BlogBanner } = require('../db/models');
const { NotFoundError } = require('../../../errors/http/http.errors');
const s3Service = require('./s3.service');
const { CommonLib } = require('../../../lib');
const BlogBannerService = {
    async createBanner(data, file) {
        if (file) {
            const image = await s3Service.uploadFile(file, 'images');
            data.image = image;
        }
        const newBanner = new BlogBanner({
            title: data.title,
            description: data.description,
            image: data.image,
            linktitle: data.linktitle,
            link: data.link,
        });
        return newBanner.save();
    },

    async getAllBanners({ page, limit, title, active, sortBy }) {
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

        const total = await BlogBanner.countDocuments(query);
        let items;

        if (page && limit) {
            const offset = (page - 1) * limit;
            items = await BlogBanner.find(query).sort(sort).skip(offset).limit(Number(limit));
        } else {
            items = await BlogBanner.find(query).sort(sort);
        }

        const pagination = CommonLib.getPagination(page, limit, total);
        return {
            items,
            pagination: page && limit ? pagination : null,
        };
    },

    async getSingleBanner(id) {
        const banner = await BlogBanner.findById(id);
        if (!banner || banner.is_deleted) {
            throw new NotFoundError('Blog banner not found');
        }
        return banner;
    },

    async updateBanner(id, data, file) {
        if (file) {
            const image = await s3Service.uploadFile(file, 'images');
            data.image = image;
        }
    
        const updates = {
            title: data.title,
            description: data.description,
            image: data.image,
            linktitle: data.linktitle,
            link: data.link,
        };
    
        const banner = await BlogBanner.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );
    
        if (!banner) {
            throw new NotFoundError('Blog banner not found');
        }
    
        return banner;
    },
    

    async deleteBanner(id) {
        const banner = await BlogBanner.findById(id);
        if (!banner) {
            throw new NotFoundError('Blog banner not found');
        }
        await BlogBanner.findByIdAndRemove(id);

        return { message: 'Blog banner deleted permanently', banner };
    },

    async toggleStatus(id) {
        const banner = await BlogBanner.findById(id);
        if (!banner || banner.is_deleted) {
            throw new NotFoundError('Blog banner not found');
        }

        banner.is_active = !banner.is_active;
        return banner.save();
    },
};

module.exports = BlogBannerService;
