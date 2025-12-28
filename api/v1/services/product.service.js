const {
  NotFoundError,
  UnprocessableEntityError,
} = require("../../../errors/http/http.errors");
const {
  Product,
  ViewedCourse,
  SavedCourse,
  EnrolledCourse,
  Type,
  ScentMarketing,
  SustainabilityModel,
  OnlineReputationManagement
} = require("../db/models");
const { CommonLib } = require("../../../lib");
const { default: mongoose } = require("mongoose");
const hotelConceptsModel = require("../db/models/hotel-concepts.model");

const ProductService = {
  // CREATE PRODUCT
  async createProduct(data) {
    const existingProduct = await Product.findOne({
      course_slug: data.course_slug, // Exact match for course_slug
      is_deleted: false,
    });
    if (existingProduct) {
      throw new Error("A product with this slug already exists.");
    }

    const newProduct = new Product(data);
    return newProduct.save();
  },

  // GET ALL PRODUCTS
  async getAllProducts({
    page,
    limit,
    course_name,
    is_active,
    is_feature,
    filters,
    sortBy,
  }) {
    const query = { is_deleted: false };
    if (course_name)
      query.course_name = { $regex: new RegExp(course_name, "i") };
    if (is_active && (is_active !== "" || is_active !== "undefined" || is_active !== "null")) query.is_active = is_active === "true";
    if (is_feature) query.is_feature = is_feature === "true";
    // Multiple ID filters
    [
      "course_topic",
      "course_time",
      "course_goal",
      "course_category",
      "course_type",
    ].forEach((field) => {
      if (filters?.[field]) {
        query[field] = { $in: filters[field].split(",") };
      }
    });

    const sortOptions = {
      1: { course_name: 1 },
      2: { course_name: -1 },
      3: { createdAt: 1 },
      4: { createdAt: -1 },
    };

    const sort = sortOptions[sortBy] || { createdAt: -1 };

    const total = await Product.countDocuments(query);
    let items;
    if (page && limit) {
      const offset = (page - 1) * limit;
      items = await Product.find(query)
        .sort(sort)
        .skip(offset)
        .limit(Number(limit))
        .populate("course_topic", "name")
        .populate("course_time", "name")
        .populate("course_goal", "name")
        .populate("course_category", "name")
        .populate("course_type", "name");
    } else {
      items = await Product.find(query)
        .sort(sort)
        .populate("course_topic", "name")
        .populate("course_time", "name")
        .populate("course_goal", "name")
        .populate("course_category", "name")
        .populate("course_type", "name");
    }
    if(filters?.course_category){
      const courseCategory = filters?.course_category;
      items.push(...(await ScentMarketing.find({"course_category._id": courseCategory}).lean()),
      ...(await hotelConceptsModel.find({"course_category._id": courseCategory}).lean()),
      ...(await SustainabilityModel.find({"course_category._id": courseCategory}).lean()),
      ...(await OnlineReputationManagement.find({"course_category._id": courseCategory}).lean())
    );
    }
    const pagination = CommonLib.getPagination(page, limit, total);
    return {
      items,
      pagination: page && limit ? pagination : null,
    };
  },

  // GET SINGLE PRODUCT
  async getSingleProduct(id) {
    const product = await Product.findById(id);
    if (!product || product.is_deleted) {
      throw new NotFoundError("Product not found");
    }
    return product;
  },

  // GET SINGLE PRODUCT
  async getBySlug(slug, discount) {
    // const product = await Product.findOne({
    //   course_slug: slug,
    //   is_deleted: false,
    //   is_active: true,
    // })
    //   .populate("course_time")
    //   .populate("course_goal")
    //   .populate("course_category")
    //   .populate("course_type")
    //   .populate({
    //     path: "course_next_id",
    //     select:
    //       "course_name course_slug course_description sana_course_id course_image course_time course_type", // Limit fields to avoid circular issues
    //     populate: [
    //       {
    //         path: "course_time", // Populate course_time inside course_next_id
    //         select: "name", // Select specific fields if needed
    //       },
    //       {
    //         path: "course_type", // Populate course_type inside course_next_id
    //         select: "name color", // Select specific fields if needed
    //       },
    //     ],
    //   })
    //   .populate("course_topic")
    //   .populate("course_teacher")
    //   .populate("course_interest")
    //   .populate("course_industry");
    const aggregatedProduct = await Product.aggregate([
      {
        $match: {
          course_slug: slug,
          is_deleted: false,
          is_active: true,
        },
      },
      {
        $lookup: {
          from: "times",
          localField: "course_time",
          foreignField: "_id",
          as: "course_time",
        },
      },
      { $unwind: { path: "$course_time", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "goals",
          localField: "course_goal",
          foreignField: "_id",
          as: "course_goal",
        },
      },
      // { $unwind: { path: "$course_goal", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "coursecategories",
          localField: "course_category",
          foreignField: "_id",
          as: "course_category",
        },
      },
      // { $unwind: { path: "$course_category", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "types",
          localField: "course_type",
          foreignField: "_id",
          as: "course_type",
        },
      },
      { $unwind: { path: "$course_type", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "products",
          localField: "course_next_id",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "times",
                localField: "course_time",
                foreignField: "_id",
                as: "course_time",
              },
            },
            {
              $unwind: {
                path: "$course_time",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "types",
                localField: "course_type",
                foreignField: "_id",
                as: "course_type",
              },
            },
            {
              $unwind: {
                path: "$course_next_id.course_type",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "course_next_id",
        },
      },      
      {
        $lookup: {
          from: "topics",
          localField: "course_topic",
          foreignField: "_id",
          as: "course_topic",
        },
      },
    
      // Lookup course_teacher
      {
        $lookup: {
          from: "taughtbies",
          localField: "course_teacher",
          foreignField: "_id",
          as: "course_teacher",
        },
      },
    
      // Lookup course_interest
      {
        $lookup: {
          from: "interests",
          localField: "course_interest",
          foreignField: "_id",
          as: "course_interest",
        },
      },
    
      // Lookup course_industry
      {
        $lookup: {
          from: "industries",
          localField: "course_industry",
          foreignField: "_id",
          as: "course_industry",
        },
      },
      {
        $addFields: {
          syllabus_accordion_block: {
            $map: {
              input: "$syllabus",
              as: "item",
              in: {
                time:       "$$item.time",
                title:      "$$item.title",
                description:"$$item.description",
                image:      "$$item.image",
                content: [
                  {
                    title: "$$item.chapter1",
                    icon:  "$$item.icon1",
                    _id:   "$$item._id"
                  },
                  {
                    title: "$$item.chapter2",
                    icon:  "$$item.icon2",
                    _id:   "$$item._id"
                  },
                  {
                    title: "$$item.chapter3",
                    icon:  "$$item.icon3",
                    _id:   "$$item._id"
                  },
                  {
                    title: "$$item.chapter4",
                    icon:  "$$item.icon4",
                    _id:   "$$item._id"
                  }
                ],
                _id: "$$item._id"
              }
            }
          }
        }
      },
    ]);    
    const product = aggregatedProduct[0];
    // Get the color from the 'type' collection where name === 'course'
    const typeDoc = await Type.findOne({ name: "Course" }).lean();
    
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    // Calculate discount if applicable
    let discountAmount = 0;
    let priceAfterDiscount = product.course_price; // Assuming `course_price` is a field in the product

    // if (discount) {
    //   discountAmount = (product.course_price * discount) / 100; // Calculate discount amount
    //   priceAfterDiscount = product.course_price - discountAmount; // Calculate price after discount
    // }

    if (product.plan_duration) {
      courseAccessDescription = await this.getAccessDescription(
        parseInt(product.plan_duration)
      );
    }

    // Return the product with discount details
    return {
      product,
      discountAmount,
      priceAfterDiscount,
      courseAccessDescription,
      discount,
      courseColor:typeDoc ? typeDoc.color:''
    };
  },

  async getAnyProductBySlug(filter) {
    const aggregatePipeline = [
      { $unionWith: { coll: "scentmarketings" } },
      { $unionWith: { coll: "sustainabilities" } },
      { $unionWith: { coll: "hotelconcepts" } },
      { $unionWith: { coll: "onlinereputationmanagements" } },
      { $match: { ...filter }}
    ];
    const product = await Product.aggregate(aggregatePipeline)
    return product[0] || {};
  },

  // UPDATE PRODUCT
  async updateProduct(id, data) {
    const existingProduct = await Product.findOne({
      course_slug: data.course_slug,
      is_deleted: false,
      _id: { $ne: id },
    });
    if (existingProduct) {
      throw new Error("A product with this slug already exists.");
    }

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product;
  },

  // DELETE PRODUCT
  async deleteProduct(id) {
    const product = await Product.findById(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    // Find all products that reference the current product (in the 'course_next_id' field), excluding the current product itself
    const referencedProducts = await Product.find({
      course_next_id: id,
      _id: { $ne: id }, // Exclude the current product by ID
    });

    // if (referencedProducts.length > 0) {
    //     throw new Error(
    //         `Product cannot be deleted. It is referenced in the 'course_next_id' field of another product: ${referencedProducts.map(p => p.course_name).join(', ')}. Please remove the reference before deleting.`
    //     );
    // }

    //await Product.findByIdAndRemove(id);

    product.is_deleted = true;
    await product.save();

    return { message: "Product deleted successfully", product };
  },

  // TOGGLE STATUS
  async toggleStatus(id) {
    const product = await Product.findById(id);
    if (!product || product.is_deleted) {
      throw new NotFoundError("Product not found");
    }

    product.is_active = !product.is_active;
    if(!product.is_active){
      const courseAddedAsNext = await Product.find({
        course_next_id: { $in : new mongoose.Types.ObjectId(id) },
        is_deleted: false,
      }).select('course_name');
      const namesOftheProducts = courseAddedAsNext.map((product) => product.course_name);
      if(courseAddedAsNext.length > 0){
        throw new UnprocessableEntityError(`Product cannot be deactivated. It is referenced in the next steps' of the product ${ namesOftheProducts.join(', ')} . Please remove the reference before deactivating.`);
      }
    }
    return product.save();
  },

  // TOGGLE STATUS
  async toggleFeature(id) {
    const product = await Product.findById(id);
    if (!product || product.is_deleted) {
      throw new NotFoundError("Product not found");
    }

    product.is_feature = !product.is_feature;
    if(product.is_feature){
      product.featured_at = new Date()
    }
    return product.save();
  },

  async addRecentlyViewedCourse(userId, courseId) {
    if (!userId || !courseId) {
      throw new UnprocessableEntityError("UserId and CourseId are required.");
    }

    // Check if the user already viewed this course
    const existingView = await ViewedCourse.findOne({ userId, courseId });

    if (existingView) {
      // Update the timestamp if the course was already viewed
      existingView.viewedAt = Date.now();
      await existingView.save();
      return { message: "Course view updated." };
    }

    // Add a new recently viewed course entry
    const newView = new ViewedCourse({ userId, courseId });
    await newView.save();

    return { message: "Course view added." };
  },

  async getRecentlyViewedCourses({ userId, page, limit }) {
    if (!userId) {
      throw new UnprocessableEntityError("UserId required.");
    }
    let courses;
    if (page && limit) {
      const offset = (page - 1) * limit;

      // Fetch recently viewed courses with pagination
      courses = await ViewedCourse.find({ userId })
        .populate({
          path: "courseId",
          select:
            "course_name course_slug course_description sana_course_id course_image course_time course_type", // Limit fields to avoid circular issues
          populate: [
            {
              path: "course_time", // Populate course_time inside course_next_id
              select: "name", // Select specific fields if needed
            },
            {
              path: "course_type", // Populate course_type inside course_next_id
              select: "name", // Select specific fields if needed
            },
          ],
        })
        .sort({ viewedAt: -1 }) // Sort by most recent
        .skip(offset)
        .limit(Number(limit));
    } else {
      courses = await ViewedCourse.find({ userId })
        .populate({
          path: "courseId",
          select:
            "course_name course_slug course_description sana_course_id course_image course_time course_type", // Limit fields to avoid circular issues
          populate: [
            {
              path: "course_time", // Populate course_time inside course_next_id
              select: "name", // Select specific fields if needed
            },
            {
              path: "course_type", // Populate course_type inside course_next_id
              select: "name", // Select specific fields if needed
            },
          ],
        }) // Populate course details
        .sort({ viewedAt: -1 }); // Sort by most recent
    }

    const total = await ViewedCourse.countDocuments({ userId }); // Total number of records

    const pagination = CommonLib.getPagination(page, limit, total);

    return {
      courses,
      pagination: page && limit ? pagination : null,
    };
  },

  async manageSavedCourse(userId, courseId) {
    if (!userId || !courseId) {
      throw new UnprocessableEntityError("UserId and CourseId are required.");
    }

    // Toggle behavior if no action is specified
    const existingSave = await SavedCourse.findOne({ userId, courseId });

    if (existingSave) {
      // Remove if exists
      //await SavedCourse.findOneAndDelete({ userId, courseId });

      //return{ message: 'Course removed from saved list.'};
      return { message: "Course already saved." };
    } else {
      // Save if not exists
      const newSave = new SavedCourse({ userId, courseId });
      await newSave.save();

      return { message: "Course saved successfully." };
    }
  },

  async getManageSavedCourse({ userId, page, limit }) {
    if (!userId) {
      throw new UnprocessableEntityError("UserId required.");
    }
    let courses;
    if (page && limit) {
      const offset = (page - 1) * limit;

      // Fetch recently viewed courses with pagination
      courses = await SavedCourse.find({ userId })
        .populate({
          path: "courseId",
          select:
            "course_name course_slug course_description sana_course_id course_image course_time course_type", // Limit fields to avoid circular issues
          populate: [
            {
              path: "course_time", // Populate course_time inside course_next_id
              select: "name", // Select specific fields if needed
            },
            {
              path: "course_type", // Populate course_type inside course_next_id
              select: "name", // Select specific fields if needed
            },
          ],
        })
        .sort({ viewedAt: -1 }) // Sort by most recent
        .skip(offset)
        .limit(Number(limit));
    } else {
      courses = await SavedCourse.find({ userId })
        .populate({
          path: "courseId",
          select:
            "course_name course_slug course_description sana_course_id course_image course_time course_type", // Limit fields to avoid circular issues
          populate: [
            {
              path: "course_time", // Populate course_time inside course_next_id
              select: "name", // Select specific fields if needed
            },
            {
              path: "course_type", // Populate course_type inside course_next_id
              select: "name", // Select specific fields if needed
            },
          ],
        }) // Populate course details
        .sort({ viewedAt: -1 }); // Sort by most recent
    }

    const total = await SavedCourse.countDocuments({ userId }); // Total number of records

    const pagination = CommonLib.getPagination(page, limit, total);

    return {
      courses,
      pagination: page && limit ? pagination : null,
    };
  },

  async enrolledCourse(userId, courseId) {
    if (!userId || !courseId) {
      throw new UnprocessableEntityError("UserId and CourseId are required.");
    }

    // Toggle behavior if no action is specified
    const existingSave = await EnrolledCourse.findOne({ userId, courseId });

    if (existingSave) {
      // Remove if exists
      // await EnrolledCourse.findOneAndDelete({ userId, courseId });

      return { message: "Course already enrolled." };
    } else {
      // Save if not exists
      const newSave = new EnrolledCourse({ userId, courseId });
      await newSave.save();

      return { message: "Course enrolled successfully." };
    }
  },

  async getEnrolledCourse({ userId, page, limit }) {
    if (!userId) {
      throw new UnprocessableEntityError("UserId required.");
    }

    const offset = page && limit ? (page - 1) * limit : 0;
    console.log(userId, "<----userId");

    const pipeline = [
      // Filter by userId
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },

      {
        $lookup: {
          from: "sustainabilities",
          localField: "courseId",
          foreignField: "_id",
          pipeline: [
            {
              $set: {
                course_time: "$enrol_single_duration",
                course_type: {
                  name : "Program",
                  color : "rgb(189, 241, 128)"
                },
              },
            },
          ],
          as: "sustainability",
        },
      },
      {
        $unwind: {
          path: "$sustainability",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Lookup from scentmarketing and unwind
      {
        $lookup: {
          from: "scentmarketings",
          localField: "courseId",
          foreignField: "_id",
          pipeline: [
            {
              $set: {
                course_time: "$enrol_single_duration",
                course_type: {
                  name : "Program",
                  color : "rgb(189, 241, 128)"
                },
              },
            },
          ],
          as: "scentmarketing",
        },
      },
      {
        $unwind: {
          path: "$scentmarketing",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Lookup from hotelconcepts and unwind
      {
        $lookup: {
          from: "hotelconcepts",
          localField: "courseId",
          foreignField: "_id",
          pipeline: [
            {
              $set: {
                course_time: "$enrol_single_duration",
                course_type: {
                  name : "Program",
                  color : "rgb(189, 241, 128)"
                },
              },
            },
          ],
          as: "hotelconcepts",
        },
      },
      {
        $unwind: {
          path: "$hotelconcepts",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "onlinereputationmanagements",
          localField: "courseId",
          foreignField: "_id",
          pipeline: [
            {
              $set: {
                course_time: "$enrol_single_duration",
                course_type: {
                  name : "Program",
                  color : "rgb(189, 241, 128)"
                },
              },
            },
          ],
          as: "onlinereputationmanagements",
        },
      },
      {
        $unwind: {
          path: "$onlinereputationmanagements",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Lookup from products and unwind
      {
        $lookup: {
          from: "products",
          localField: "courseId",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "times",
                localField: "course_time",
                foreignField: "_id",
                as: "TIMES",
              },
            },
            {
              $unwind: {
                path : "$TIMES",
                preserveNullAndEmptyArrays : true
              },
            },
            {
              $lookup: {
                from: "types",
                localField: "course_type",
                foreignField: "_id",
                as: "TYPES",
              },
            },
            {
              $unwind: {
                path : "$TYPES",
                preserveNullAndEmptyArrays : true
              },
            },
            {
              $set : {
                course_time : "$TIMES.name",
                course_type : {
                  name : "$TYPES.name",
                  color : "$TYPES.color"
                }
              }
            },
            {
              $unset : ["TIMES", "TYPES"]
            }
          ],
          as: "Product",
        },
      },
      {
        $unwind: {
          path: "$Product",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Combine lookup results into a single courseDetails field using an ifNull chain
      {
        $addFields: {
          courseDetails: {
            $ifNull: [
              "$onlinereputationmanagements",
              {
                $ifNull: [
                  "$sustainability",
                  {
                    $ifNull: [
                      "$scentmarketing",
                      {
                        $ifNull: [
                          "$hotelconcepts",
                          "$Product",
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      // Lookup the course type details from the type model (coursetypes collection)
      // {
      //   $lookup: {
      //     from: "types",
      //     // New collection name for the course type model
      //     localField: "courseDetails.course_type",
      //     foreignField: "_id",
      //     as: "courseType",
      //   },
      // },
      // {
      //   $unwind: {
      //     path: "$courseType",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      // // Replace course_type in courseDetails with the populated courseType document
      // {
      //   $addFields: {
      //     "courseDetails.course_type": "$courseType",
      //   },
      // },
      // Project the desired fields
      {
        $project: {
          _id: 1,
          viewedAt: 1,
          courseDetails: {
            course_name: "$courseDetails.course_name",
            course_slug: "$courseDetails.course_slug",
            course_description:
              "$courseDetails.course_description",
            sana_course_id:
              "$courseDetails.sana_course_id",
            course_image:
              "$courseDetails.course_image",
            course_time:
              "$courseDetails.course_time",
            course_type: "$courseDetails.course_type",
            subscription_date: "$subscription_date",
            subscription_end_date:
              "$subscription_end_date",
          },
        },
      },
      // Sort by viewedAt in descending order (most recent first)
      {
        $sort: {
          viewedAt: -1,
        },
      },
    ];

    // Apply pagination if page and limit are provided
    if (page && limit) {
      pipeline.push({ $skip: offset });
      pipeline.push({ $limit: Number(limit) });
    }

    // Execute the aggregation pipeline
    const courses = await EnrolledCourse.aggregate(pipeline);

    // Get total record count (without pagination)
    const total = await EnrolledCourse.countDocuments({ userId });
    const pagination = CommonLib.getPagination(page, limit, total);

    return {
      courses,
      pagination: page && limit ? pagination : null,
    };
  },

  async getAccessDescription(months) {
    if (months < 12) {
      return `${months} months access to the chosen course`;
    } else if (months === 12) {
      return `1 year access to the chosen course`;
    } else if (months > 12) {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      let description = `${years} year${years > 1 ? "s" : ""}`;
      if (remainingMonths > 0) {
        description += ` and ${remainingMonths} month${
          remainingMonths > 1 ? "s" : ""
        }`;
      }
      description += ` access to the chosen course`;
      return description;
    } else {
      return `Invalid duration`;
    }
  },
};

module.exports = ProductService;
