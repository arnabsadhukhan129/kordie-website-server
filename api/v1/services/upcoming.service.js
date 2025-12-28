const { default: mongoose } = require("mongoose");
const { NotFoundError } = require("../../../errors/http/http.errors");
const { CommonLib, StringLib } = require("../../../lib");
const Upcoming = require("../db/models/upcoming.model");
function removeHtmlTags(str) {
  if (typeof str === "string") {
    return str.replace(/<[^>]*>/g, "");
  }
  return str;
}

const upcomingService = {
  async createUpcoming(data) {
    try {
      //    const sanitizedCourseName = removeHtmlTags(data.course_name);
      //                               const course_slug = StringLib.generateSlug(sanitizedCourseName);
      //    if (!data.course_name) {
      //           throw { status: 400, message: 'Title is required to generate course_slug.' };
      //         }

      //         data.course_slug = course_slug;

      //         if (!data.course_slug) {
      //           throw { status: 400, message: 'Failed to generate course_slug from the title.' };
      // }

      const upcoming = new Upcoming(data);
      await upcoming.save();
      return upcoming;
    } catch (error) {
      if (error.message.includes("A record already exists")) {
        throw { status: 409, message: error.message };
      } else if (
        error.message.includes("cannot have more than") ||
        error.name === "ValidationError"
      ) {
        throw { status: 400, message: error.message };
      }
      throw { status: 500, message: "Internal server error" };
    }
  },

  async getAllupcoming({ page, limit, sort, filters }) {
    const initialFilters = { ...filters, is_deleted: false };
    const finalFilters = { ...initialFilters };
    if (finalFilters.title) {
      finalFilters.title = { $regex: finalFilters.title, $options: "i" };
    }
    if (finalFilters.categeoryId) {
      finalFilters.categeoryId = {
        $in: [new mongoose.Types.ObjectId(finalFilters.categeoryId)],
      };
    }
    const pipeline = [
      { $match: finalFilters },
      {
        $lookup: {
          from: "coursecategories",
          localField: "categeoryId",
          foreignField: "_id",
          as: "courseCategories",
        },
      },

      {
        $addFields: {
          categoryNames: {
            $map: {
              input: "$courseCategories",
              as: "cat",
              in: "$$cat.name",
            },
          },
        },
      },

      {
        $project: {
          tag: 1,
          title: 1,
          description: 1,
          image: 1,
          time: 1,
          year: 1,
          month: 1,
          is_deleted: 1,
          categeoryId: 1,
          categoryNames: 1,
        },
      },
    ];

    if (sort) {
      pipeline.push({ $sort: sort });
    }

    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: limit });

    const data = await Upcoming.aggregate(pipeline);

    const total = await Upcoming.countDocuments(filters);

    const pagination = CommonLib.getPagination(page, limit, total);

    return { data, pagination };
  },

  async getUpcomingId(id) {
    try {
      const pipeline = [
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: "coursecategories",
            localField: "categeoryId",
            foreignField: "_id",
            as: "courseCategories",
          },
        },

        {
          $addFields: {
            categoryNames: {
              $map: {
                input: "$courseCategories",
                as: "cat",
                in: "$$cat.name",
              },
            },
          },
        },

        {
          $project: {
            tag: 1,
            title: 1,
            description: 1,
            image: 1,
            time: 1,
            year: 1,
            month: 1,
            is_deleted: 1,
            categeoryId: 1,
            categoryNames: 1,
          },
        },
      ];

      const result = await Upcoming.aggregate(pipeline);

      return result[0];
    } catch (error) {
      throw new Error(error.message || "Error fetching record by ID");
    }
  },

  //   async getSustainabilityBySlug(slug) {
  //     try {
  //       // You can add additional logic here if needed (e.g., validation)
  //       const record = await Sustainability.findOne({course_slug: slug}).lean();
  //       return record;
  //     } catch (error) {
  //       throw new Error(error.message || 'Error fetching record by ID');
  //     }
  //   },

  async updateUpcoming(id, updatedData) {
    try {
      //    const sanitizedCourseName = removeHtmlTags(updatedData.course_name);
      //                               const course_slug = StringLib.generateSlug(sanitizedCourseName);
      //   if (!updatedData.course_name) {
      //               throw { status: 400, message: 'Title is required to generate course_slug.' };
      //             }

      //             updatedData.course_slug = course_slug;

      //             if (!updatedData.course_slug) {
      //               throw { status: 400, message: 'Failed to generate course_slug from the title.' };
      //             }
      const updatedRecord = await Upcoming.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
      });
      return updatedRecord;
    } catch (error) {
      throw new Error(error.message || "Error updating Upcoming record");
    }
  },

  async deleteUpcoming(id) {
    try {
      const deletedRecord = await Upcoming.findByIdAndUpdate(
        id,
        { is_deleted: true },
        { new: true } // returns the updated document
      );
      return deletedRecord;
    } catch (error) {
      throw new Error(error.message || "Error deleting Upcoming record");
    }
  },
};
module.exports = upcomingService;
