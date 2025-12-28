const OnlineProgram = require("../db/models/online-programs.modal.js");
const { CommonLib } = require("../../../lib");
const { default: mongoose } = require("mongoose");
const onlineProgramService = {
  // Service to create a new Program entry
  async createProgram(Data) {
    try {
      const newProgram = new OnlineProgram(Data);
      const savedProgram = await newProgram.save();
      return savedProgram;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Service to get all Program entries
  async getAllProgram({ page, limit, sort, filters }) {
    if (filters && filters.title) {
      filters.title = { $regex: new RegExp(filters.title, "i") };
    }

    const aggregationPipeline = [
      { $match: filters },
      {
    $lookup: {
      from: "sustainabilities",
      let: {
        courseIds: "$courseId",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $in: ["$_id", "$$courseIds"],
                },
                {
                  $eq: ["$is_featured", true],
                },
              ],
            },
          },
        },
      ],
      as: "sustainabilityData",
    },
  },
  // Lookup for scentmarketing collection with is_featured true
  {
    $lookup: {
      from: "scentmarketings",
      let: {
        courseIds: "$courseId",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $in: ["$_id", "$$courseIds"],
                },
                {
                  $eq: ["$is_featured", true],
                },
              ],
            },
          },
        },
      ],
      as: "scentmarketingData",
    },
  },
  // Lookup for hotelconcepts collection with is_featured true
  {
    $lookup: {
      from: "hotelconcepts",
      let: {
        courseIds: "$courseId",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $in: ["$_id", "$$courseIds"],
                },
                {
                  $eq: ["$is_featured", true],
                },
              ],
            },
          },
        },
      ],
      as: "hotelconceptData",
    },
  },
  // Lookup for products collection (no featured filtering)
  {
    $lookup: {
      from: "products",
      let: {
        courseIds: "$courseId",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $in: ["$_id", "$$courseIds"],
                },
                {
                  $eq: ["$is_feature", true],
                },
                {
                  $eq: ["$is_deleted", false],
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: "times",
            localField: "course_time",
            foreignField: "_id",
            as: "COURSE_TIME",
          },
        },
        {
          $unwind: {
            path: "$COURSE_TIME",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            featured_at: -1,
          },
        },
      ],
      as: "productsData",
    },
  },
  {
    $project: {
      link: 1,
      tag: 1,
      createdAt: 1,
      updatedAt: 1,
      allCourses: {
        $concatArrays: [
          {
            $map: {
              input: "$sustainabilityData",
              as: "course",
              in: {
                course_name:
                  "$$course.course_name",
                banner_media:
                  "$$course.banner_media",
                course_image:
                  "$$course.course_image",
                plan_duration:
                  "$$course.plan_duration",
                course_duration:
                  "$$course.enrol_single_duration",
                course_type: "program",
                featured_at:
                  "$$course.featured_at",
                link_url:
                  "/exclusive-program/sustainability",
              },
            },
          },
          {
            $map: {
              input: "$scentmarketingData",
              as: "course",
              in: {
                course_name:
                  "$$course.course_name",
                banner_media:
                  "$$course.banner_media",
                course_image:
                  "$$course.course_image",
                plan_duration:
                  "$$course.plan_duration",
                course_duration:
                  "$$course.enrol_single_duration",
                course_type: "program",
                featured_at:
                  "$$course.featured_at",
                link_url:
                  "/exclusive-program/scent-marketing",
              },
            },
          },
          {
            $map: {
              input: "$hotelconceptData",
              as: "course",
              in: {
                course_name:
                  "$$course.course_name",
                banner_media:
                  "$$course.banner_media",
                course_image:
                  "$$course.course_image",
                plan_duration:
                  "$$course.plan_duration",
                course_duration:
                  "$$course.enrol_single_duration",
                course_type: "program",
                featured_at:
                  "$$course.featured_at",
                link_url:
                  "/exclusive-program/hotel-concepts",
              },
            },
          },
          {
            $map: {
              input: "$productsData",
              as: "course",
              in: {
                course_name:
                  "$$course.course_name",
                course_slug:
                  "$$course.course_slug",
                course_image:
                  "$$course.course_image",
                plan_duration:
                  "$$course.plan_duration",
                course_duration:
                  "$$course.COURSE_TIME.name",
                course_type: "course",
                featured_at:
                  "$$course.featured_at",
              },
            },
          },
        ],
      },
    },
  },
  // Sort the merged array and pick top 3
  {
    $addFields: {
      sortedItems: {
        $slice: [
          {
            $sortArray: {
              input: "$allCourses",
              sortBy: {
                featured_at: -1,
              },
            },
          },
          3,
        ],
      },
    },
  },
  {
    $project: {
      items: "$sortedItems",
      link: 1,
      tag: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
    ];

    if (sort) {
      aggregationPipeline.push({ $sort: sort });
    }

    aggregationPipeline.push({ $skip: (page - 1) * limit });
    aggregationPipeline.push({ $limit: limit });

    const total = await OnlineProgram.countDocuments(filters);
    const data = await OnlineProgram.aggregate(aggregationPipeline);
    const pagination = CommonLib.getPagination(page, limit, total);

    return { data, pagination };
  },


  //// Service to get all Program entries
  async getAllExclusiveProgram({ page, limit, sort, filters }) {
    if (filters && filters.title) {
      filters.title = { $regex: new RegExp(filters.title, "i") };
    }

    const aggregationPipeline = [
      
      {
        $lookup: {
          from: "sustainabilities",
          let: { courseIds: "$courseId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$_id", "$$courseIds"] },
                  ],
                },
              },
            },
          ],
          as: "sustainabilityData",
        },
      },
     
      {
        $lookup: {
          from: "scentmarketings",
          let: { courseIds: "$courseId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$_id", "$$courseIds"] },
                  ],
                },
              },
            },
          ],
          as: "scentmarketingData",
        },
      },
      // Lookup for hotelconcepts collection with is_featured true
      {
        $lookup: {
          from: "hotelconcepts",
          let: { courseIds: "$courseId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$_id", "$$courseIds"] },
                  ],
                },
              },
            },
          ],
          as: "hotelconceptData",
        },
      },
      // Project the lookup results into a temporary array, filter out empty ones,
      // and then assign dynamic names while flattening the array.
      {
        $project: {
          link: 1,
          tag: 1,
          createdAt: 1,
          updatedAt: 1,
          items: {
            $let: {
              vars: {
                temp: {
                  $filter: {
                    input: [
                      {
                        $map: {
                          input: "$sustainabilityData",
                          as: "course",
                          in: {
                            course_name: "$$course.course_name",
                            link_url: "/exclusive-program/sustainability",
                          },
                        },
                      },
                      {
                        $map: {
                          input: "$scentmarketingData",
                          as: "course",
                          in: {
                            course_name: "$$course.course_name",
                            link_url: "/exclusive-program/scent-marketing",
                          },
                        },
                      },
                      {
                        $map: {
                          input: "$hotelconceptData",
                          as: "course",
                          in: {
                            course_name: "$$course.course_name",
                            link_url: "/exclusive-program/hotel-concepts",
                          },
                        },
                      },
                    ],
                    cond: { $gt: [{ $size: "$$this" }, 0] },
                  },
                },
              },
              in: {
                $map: {
                  input: { $range: [0, { $size: "$$temp" }] },
                  as: "idx",
                  in: {
                    name: {
                      $concat: ["item ", { $toString: { $add: ["$$idx", 1] } }],
                    },
                    // Flatten the array by taking the first element
                    course: {
                      $arrayElemAt: [{ $arrayElemAt: ["$$temp", "$$idx"] }, 0],
                    },
                  },
                },
              },
            },
          },
        },
      },
    ];

    if (sort) {
      aggregationPipeline.push({ $sort: sort });
    }

    aggregationPipeline.push({ $skip: (page - 1) * limit });
    aggregationPipeline.push({ $limit: limit });

    const total = await OnlineProgram.countDocuments(filters);
    const data = await OnlineProgram.aggregate(aggregationPipeline);
    const pagination = CommonLib.getPagination(page, limit, total);

    return { data, pagination };
  },


  //   get a single Program entry by ID
  async getProgramById(id) {
    try {
      // Validate the id first
      if (!mongoose.isValidObjectId(id)) {
        throw new Error("Invalid Program ID");
      }
  
      const aggregationPipeline = [
        {
          $lookup: {
            from: "sustainabilities",
            let: { courseIds: "$courseId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ["$_id", "$$courseIds"] },
                      { $eq: ["$is_featured", true] },
                    ],
                  },
                },
              },
            ],
            as: "sustainabilityData",
          },
        },
        {
          $lookup: {
            from: "scentmarketings",
            let: { courseIds: "$courseId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ["$_id", "$$courseIds"] },
                      { $eq: ["$is_featured", true] },
                    ],
                  },
                },
              },
            ],
            as: "scentmarketingData",
          },
        },
        // Lookup for hotelconcepts collection with is_featured true
        {
          $lookup: {
            from: "hotelconcepts",
            let: { courseIds: "$courseId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ["$_id", "$$courseIds"] },
                      { $eq: ["$is_featured", true] },
                    ],
                  },
                },
              },
            ],
            as: "hotelconceptData",
          },
        },
        // Lookup for products collection (no featured filtering)
        {
          $lookup: {
            from: "products",
            localField: "courseId",
            foreignField: "_id",
            as: "productsData",
          },
        },
        // Project the lookup results into a temporary array, filter out empty ones,
        // and then assign dynamic names while flattening the array.
        {
          $project: {
            link: 1,
            tag: 1,
            createdAt: 1,
            updatedAt: 1,
            items: {
              $let: {
                vars: {
                  temp: {
                    $filter: {
                      input: [
                        {
                          $map: {
                            input: "$sustainabilityData",
                            as: "course",
                            in: {
                              course_name: "$$course.course_name",
                              banner_media: "$$course.banner_media",
                              course_image: "$$course.course_image",
                              plan_duration: "$$course.plan_duration",
                              course_type: "program",
                              link_url: "/exclusive-program/sustainability",
                            },
                          },
                        },
                        {
                          $map: {
                            input: "$scentmarketingData",
                            as: "course",
                            in: {
                              course_name: "$$course.course_name",
                              banner_media: "$$course.banner_media",
                              course_image: "$$course.course_image",
                              plan_duration: "$$course.plan_duration",
                              course_type: "program",
                              link_url: "/exclusive-program/scent-marketing",
                            },
                          },
                        },
                        {
                          $map: {
                            input: "$hotelconceptData",
                            as: "course",
                            in: {
                              course_name: "$$course.course_name",
                              banner_media: "$$course.banner_media",
                              course_image: "$$course.course_image",
                              plan_duration: "$$course.plan_duration",
                              course_type: "program",
                              link_url: "/exclusive-program/hotel-concepts",
                            },
                          },
                        },
                        {
                          $map: {
                            input: "$productsData",
                            as: "course",
                            in: {
                              course_name: "$$course.course_name",
                              course_slug: "$$course.course_slug",
                              course_image: "$$course.course_image",
                              plan_duration: "$$course.plan_duration",
                              course_type: "course",
                            },
                          },
                        },
                      ],
                      cond: { $gt: [{ $size: "$$this" }, 0] },
                    },
                  },
                },
                in: {
                  $map: {
                    input: { $range: [0, { $size: "$$temp" }] },
                    as: "idx",
                    in: {
                      name: {
                        $concat: ["item ", { $toString: { $add: ["$$idx", 1] } }],
                      },
                      // Flatten the array by taking the first element
                      course: {
                        $arrayElemAt: [{ $arrayElemAt: ["$$temp", "$$idx"] }, 0],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ];
  
      const result = await OnlineProgram.aggregate(aggregationPipeline);
  
      // If no document was found, throw an error
      if (!result || result.length === 0) {
        throw new Error("Program not found");
      }
  
      return result[0];
    } catch (error) {
      // You can log the error here if needed
      throw new Error(error.message || "Invalid or non-existent Program ID");
    }
  }
,  
  async updateProgram(id, updateData) {
    try {
      const updatedProgram = await OnlineProgram.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).lean();
      return updatedProgram;
    } catch (error) {
      throw new Error("Invalid or non-existent Program ID");
    }
  },

  async deleteProgram(id) {
    try {
      const deletedProgram = await OnlineProgram.findByIdAndDelete(
        id
      ).lean();
      return deletedProgram;
    } catch (error) {
      throw new Error("Invalid or non-existent Program ID");
    }
  },

  async getOnlinePrograms(filter){
    return await OnlineProgram.findOne(filter).lean();
  }
};

module.exports = onlineProgramService;
