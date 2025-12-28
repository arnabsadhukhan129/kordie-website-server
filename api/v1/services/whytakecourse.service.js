// //---------------------NOW USING INSIDE PRODUCT PAGE________________________________________



// const { NotFoundError, ConflictError } = require('../../../errors/http/http.errors');
// const { WhyTakeCourse } = require('../db/models');
// const s3Service = require('./s3.service');
// const { CommonLib, StringLib } = require('../../../lib');

// const WhyTakeCourseService = {
//     async create(data, file) {
//         if (file) {
//             const image = await s3Service.uploadFile(file, 'images');
//             data.image = image;
//         }

//         const slug = StringLib.generateSlug(data.title);

//         // Check if the slug already exists
//         const existingCourse = await WhyTakeCourse.findOne({ slug, is_deleted: false });
//         if (existingCourse) {
//             throw new ConflictError('A course with this slug already exists');
//         }

//         const newCourse = new WhyTakeCourse({
//             title: data.title,
//             slug,
//             image: data.image,
//             description: data.description,
//         });

//         return newCourse.save();
//     },

//     async getAll({ page, limit, title, active, sortBy }) {
//         const query = { is_deleted: false };
//         if (title) query.title = { $regex: new RegExp(title, 'i') };
//         if (active) query.is_active = active === 'true';

//         const sortOptions = {
//             '1': { title: 1 },
//             '2': { title: -1 },
//             '3': { createdAt: 1 },
//             '4': { createdAt: -1 },
//         };

//         const sort = sortOptions[sortBy] || { createdAt: -1 };

//         const total = await WhyTakeCourse.countDocuments(query);
//         let items;
//         if (page && limit) {
//             const offset = (page - 1) * limit;
//             items = await WhyTakeCourse.find(query).sort(sort).skip(offset).limit(Number(limit));
//         } else {
//             items = await WhyTakeCourse.find(query).sort(sort);
//         }

//         const pagination = CommonLib.getPagination(page, limit, total);

//         return {
//             items,
//             pagination: page && limit ? pagination : null,
//         };
//     },

//     async getSingle(id) {
//         const course = await WhyTakeCourse.findById(id);
//         if (!course || course.is_deleted) {
//             throw new NotFoundError('Course not found');
//         }
//         return course;
//     },

//     async update(id, data, file) {
//         if (file) {
//             const image = await s3Service.uploadFile(file, 'images');
//             data.image = image;
//         }

//         const slug = StringLib.generateSlug(data.title);

//         // Check if another course with the same slug exists
//         const existingCourse = await WhyTakeCourse.findOne({ slug, _id: { $ne: id }, is_deleted: false });
//         if (existingCourse) {
//             throw new ConflictError('A course with this slug already exists');
//         }

//         const course = await WhyTakeCourse.findByIdAndUpdate(
//             id,
//             { title: data.title, slug, image: data.image, description: data.description },
//             { new: true }
//         );

//         if (!course) {
//             throw new NotFoundError('Course not found');
//         }
//         return course;
//     },

//     async delete(id) {
//         const course = await WhyTakeCourse.findById(id);
//         if (!course) {
//             throw new NotFoundError('Course not found');
//         }
//         await WhyTakeCourse.findByIdAndRemove(id);
//         return { message: 'Course deleted permanently', course };
//     },

//     async toggleStatus(id) {
//         const course = await WhyTakeCourse.findById(id);
//         if (!course || course.is_deleted) {
//             throw new NotFoundError('Course not found');
//         }
//         course.is_active = !course.is_active;
//         return course.save();
//     },
// };

// module.exports = WhyTakeCourseService;
