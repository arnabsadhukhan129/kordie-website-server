const { NotFoundError } = require('../../../errors/http/http.errors');
const { TaughtBy,Product } = require('../db/models');
const { CommonLib } = require('../../../lib');
const s3Service = require('./s3.service'); 
const TaughtByService = {
    // CREATE TAUGHT BY
    async createTaughtBy(data, file) {
        if(file){
            const image = await s3Service.uploadFile(file, 'images');
            data.image = image;
        }
        const newTaughtBy = new TaughtBy({
            name: data.name,
            designation: data.designation,
            image: data.image,
            description: data.description,
            experience: data.experience,
            benifit: data.benifit,
            skill: data.skill
        });

        return newTaughtBy.save();
    },

    // GET ALL TAUGHT BY
    async getAllTaughtBy({ page, limit, name, active, sortBy }) {
        const query = { is_deleted: false };
        if (name) query.name = { $regex: new RegExp(name, 'i') };
        if (active) query.is_active = active === 'true';

        const sortOptions = {
            '1': { name: 1 },
            '2': { name: -1 },
            '3': { createdAt: 1 },
            '4': { createdAt: -1 },
        };

        const sort = sortOptions[sortBy] || { createdAt: -1 };

        const total = await TaughtBy.countDocuments(query);

        let items;
        if (page && limit) {
            const offset = (page - 1) * limit;
            items = await TaughtBy.find(query).sort(sort).skip(offset).limit(Number(limit));
        } else {
            items = await TaughtBy.find(query).sort(sort);
        }
        const pagination = CommonLib.getPagination(page, limit, total);
        return {
            items,
            pagination: page && limit ? pagination : null,
        };
    },

    // GET SINGLE TAUGHT BY
    async getSingleTaughtBy(id) {
        const taughtBy = await TaughtBy.findById(id);
        if (!taughtBy || taughtBy.is_deleted) {
            throw new NotFoundError('Taught by not found');
        }
        return taughtBy;
    },

    // UPDATE TAUGHT BY
    async updateTaughtBy(id, data, file) {
        if(file){
            const image = await s3Service.uploadFile(file, 'images');
            data.image = image;
        }
        const taughtBy = await TaughtBy.findByIdAndUpdate(
            id,
            { name: data.name, designation: data.designation, image: data.image ,description: data.description,
                experience: data.experience,
                benifit: data.benifit,
                skill: data.skill},
            { new: true }
        );

        if (!taughtBy) {
            throw new NotFoundError('Taught by not found');
        }

        return taughtBy;
    },

    // DELETE TAUGHT BY - Hard Delete
    async deleteTaughtBy(id) {
        const taughtBy = await TaughtBy.findById(id);

        if (!taughtBy) {
            throw new NotFoundError('Taught by not found');
        }

         // Check if the 'TaughtBy' entry is assigned to any product
         const productUsingTaughtBy = await Product.findOne({ course_teacher: id, is_deleted:false });
         if (productUsingTaughtBy) {
             throw new Error(
                 `Taught by cannot be deleted. It is assigned to the product. Please unassign the 'Taught by' entry first.`
             );
         }

        // Permanently delete the document from the database
        await TaughtBy.findByIdAndRemove(id);

        return { message: 'Taught by deleted permanently', taughtBy };
    },

    // TOGGLE STATUS
    async toggleStatus(id) {
        const taughtBy = await TaughtBy.findById(id);
        if (!taughtBy || taughtBy.is_deleted) {
            throw new NotFoundError('Taught by not found');
        }

        taughtBy.is_active = !taughtBy.is_active;
        return taughtBy.save();
    },
};

module.exports = TaughtByService;
