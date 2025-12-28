const { User, CommentsLogModel, Payment, Plan } = require("../db/models");

const CustomerService = {
  async addPayment(paymentArray, planData) {
    const payment = await Payment.insertMany(paymentArray);
    if (planData && Object.keys(planData).length > 0) {
      await Plan.create(planData);
    }
    return payment;
  },
  async listCustomer({ filter, sort, searchObject = {} }) {
    const customers = await User.aggregate([
      {
        $match: filter,
      },
      {
        $sort: sort,
      },
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "customer_id",
          pipeline: [
            {
              $lookup: {
                from: "subscription_plans",
                localField: "subcription_plan_id",
                foreignField: "_id",
                pipeline: [
                  {
                    $project: {
                      plan_name: 1,
                      slug: 1,
                      discount: 1,
                      sub_title: 1,
                      details: 1,
                      price: 1,
                      special_note: 1,
                    },
                  },
                ],
                as: "PLANS",
              },
            },
            {
              $lookup: {
                from: "scentmarketings",
                localField: "course_id",
                foreignField: "_id",
                as: "scentCourses",
              },
            },
            {
              $lookup: {
                from: "hotelconcepts",
                localField: "course_id",
                foreignField: "_id",
                as: "hotelCourses",
              },
            },
            {
              $lookup: {
                from: "sustainabilities",
                localField: "course_id",
                foreignField: "_id",
                as: "sustainabilityCourses",
              },
            },
            {
              $lookup: {
                from: "products",
                localField: "course_id",
                foreignField: "_id",
                as: "productCourses",
              },
            },
            {
              $addFields: {
                COURSES: {
                  $setUnion: [
                    "$scentCourses",
                    "$hotelCourses",
                    "$sustainabilityCourses",
                    "$productCourses",
                  ],
                },
              },
            },
            {
              $project: {
                PLANS: 1,
                COURSES: 1,
              },
            },
          ],
          as: "PAYMENTS",
        },
      },
      {
        $lookup: {
          from: "enrolledcourses",
          localField: "_id",
          foreignField: "userId",
          pipeline: [
            {
              $lookup: {
                from: "scentmarketings",
                localField: "courseId",
                foreignField: "_id",
                as: "scentCourses",
              },
            },
            {
              $lookup: {
                from: "hotelconcepts",
                localField: "courseId",
                foreignField: "_id",
                as: "hotelCourses",
              },
            },
            {
              $lookup: {
                from: "sustainabilities",
                localField: "courseId",
                foreignField: "_id",
                as: "sustainabilityCourses",
              },
            },
            {
              $lookup: {
                from: "products",
                localField: "courseId",
                foreignField: "_id",
                as: "productCourses",
              },
            },
            {
              $addFields: {
                COURSES: {
                  $setUnion: [
                    "$scentCourses",
                    "$hotelCourses",
                    "$sustainabilityCourses",
                    "$productCourses",
                  ],
                },
              },
            },
          ],
          as: "ENROLLED_COURSES",
        },
      },
      {
        $project: {
          fullName: {
            $concat: [
              { $ifNull: ["$first_name", ""] },
              " ",
              { $ifNull: ["$last_name", ""] },
            ],
          },
          first_name: 1,
          last_name: 1,
          email: 1,
          PAYMENTS: 1,
          ENROLLED_COURSES: 1,
          picture: 1,
          phone: 1,
          is_active: 1,
          createdAt: 1,
        },
      },
      {
        $addFields: {
          ALL_PLANS: {
            $reduce: {
              input: "$PAYMENTS",
              initialValue: [],
              in: {
                $concatArrays: ["$$value", "$$this.PLANS"],
              },
            },
          },
          ALL_PAYMENT_COURSES: {
            $reduce: {
              input: "$PAYMENTS",
              initialValue: [],
              in: {
                $concatArrays: ["$$value", "$$this.COURSES"],
              },
            },
          },
        },
      },
      {
        $match: {
          $expr: { $gt: [{ $size: "$PAYMENTS" }, 0] },
        },
      },
      {
        $unset: [
          "PAYMENTS",
          "ENROLLED_COURSES",
          "ALL_PLANS",
          "ALL_PAYMENT_COURSES",
        ],
      },
      {
        $match: searchObject,
      },
    ]);
    return customers;
  },
  async getOneCustomer(filter) {
    const customer = await User.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "customer_id",
          pipeline: [
            {
              $lookup: {
                from: "subscription_plans",
                localField: "subcription_plan_id",
                foreignField: "_id",
                pipeline: [
                  {
                    $project: {
                      plan_name: 1,
                      slug: 1,
                      sub_title: 1,
                      details: 1,
                      price: 1,
                      special_note: 1,
                    },
                  },
                ],
                as: "PLANS",
              },
            },
            {
              $addFields: {
                PLANS: {
                  $map: {
                    input: "$PLANS",
                    as: "plan",
                    in: {
                      $mergeObjects: [
                        "$$plan",
                        {
                          purchased_at: "$createdAt",
                          paid_amount: "$paid_amount",
                          payment_method_type : "$payment_method_type",
                          discount : "$discount_amount"
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              $lookup: {
                from: "scentmarketings",
                localField: "course_id",
                foreignField: "_id",
                pipeline: [
                  {
                    $project: {
                      course_name: 1,
                      course_slug: 1,
                      course_description: 1,
                      course_image: 1,
                      course_price: "$enrol_single_price",
                      course_price_text: 1,
                      course_certificate: 1,
                    },
                  },
                ],
                as: "scentCourses",
              },
            },
            {
              $lookup: {
                from: "hotelconcepts",
                localField: "course_id",
                foreignField: "_id",
                pipeline: [
                  {
                    $project: {
                      course_name: 1,
                      course_slug: 1,
                      course_description: 1,
                      course_image: 1,
                      course_price: "$enrol_single_price",
                      course_price_text: 1,
                      course_certificate: 1,
                    },
                  },
                ],
                as: "hotelCourses",
              },
            },
            {
              $lookup: {
                from: "sustainabilities",
                localField: "course_id",
                foreignField: "_id",
                pipeline: [
                  {
                    $project: {
                      course_name: 1,
                      course_slug: 1,
                      course_description: 1,
                      course_image: 1,
                      course_price: "$enrol_single_price",
                      course_price_text: 1,
                      course_certificate: 1,
                    },
                  },
                ],
                as: "sustainabilityCourses",
              },
            },
            {
              $lookup: {
                from: "products",
                localField: "course_id",
                foreignField: "_id",
                pipeline: [
                  {
                    $project: {
                      course_name: 1,
                      course_slug: 1,
                      course_description: 1,
                      course_image: 1,
                      course_price: 1,
                      course_price_text: 1,
                      course_certificate: 1,
                    },
                  },
                ],
                as: "productCourses",
              },
            },
            {
              $addFields: {
                COURSES: {
                  $setUnion: [
                    "$scentCourses",
                    "$hotelCourses",
                    "$sustainabilityCourses",
                    "$productCourses",
                  ],
                },
              },
            },
            {
              $addFields: {
                COURSES: {
                  $map: {
                    input: "$COURSES",
                    as: "course",
                    in: {
                      $mergeObjects: [
                        "$$course",
                        {
                          purchased_at: "$createdAt",
                          paid_amount: "$paid_amount",
                          payment_method_type : "$payment_method_type",
                          discount : "$discount_amount"
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              $project: {
                PLANS: 1,
                COURSES: 1,
              },
            },
          ],

          as: "PAYMENTS",
        },
      },
      {
        $lookup: {
          from: "enrolledcourses",
          localField: "_id",
          foreignField: "userId",
          pipeline: [
            {
              $lookup: {
                from: "scentmarketings",
                localField: "courseId",
                foreignField: "_id",
                as: "scentCourses",
              },
            },
            {
              $lookup: {
                from: "hotelconcepts",
                localField: "courseId",
                foreignField: "_id",
                as: "hotelCourses",
              },
            },
            {
              $lookup: {
                from: "sustainabilities",
                localField: "courseId",
                foreignField: "_id",
                as: "sustainabilityCourses",
              },
            },
            {
              $lookup: {
                from: "products",
                localField: "courseId",
                foreignField: "_id",
                as: "productCourses",
              },
            },
            {
              $addFields: {
                COURSES: {
                  $setUnion: [
                    "$scentCourses",
                    "$hotelCourses",
                    "$sustainabilityCourses",
                    "$productCourses",
                  ],
                },
              },
            },
          ],
          as: "ENROLLED_COURSES",
        },
      },
      {
        $project: {
          fullName: {
            $concat: [
              {
                $ifNull: ["$first_name", ""],
              },
              " ",
              {
                $ifNull: ["$last_name", ""],
              },
            ],
          },
          first_name: 1,
          last_name: 1,
          email: 1,
          PAYMENTS: 1,
          ENROLLED_COURSES: 1,
          picture: 1,
          phone: 1,
          is_active: 1,
          createdAt: 1,
        },
      },
      {
        $addFields: {
          ALL_PLANS: {
            $reduce: {
              input: "$PAYMENTS",
              initialValue: [],
              in: {
                $concatArrays: ["$$value", "$$this.PLANS"],
              },
            },
          },
          ALL_PAYMENT_COURSES: {
            $reduce: {
              input: "$PAYMENTS",
              initialValue: [],
              in: {
                $concatArrays: ["$$value", "$$this.COURSES"],
              },
            },
          },
        },
      },
      {
        $unset: ["PAYMENTS", "ENROLLED_COURSES"],
      },
    ]);
    return customer[0] || {};
  },
  async getOneUser(filter) {
    const user = await User.findOne(filter).lean();
    return user;
  },
  async updateCustomer({ filter, customerUpdateOptions }) {
    const result = await User.updateOne(filter, {
      $set: customerUpdateOptions,
    });
    return result;
  },
  async createComment(data) {
    const comment = await CommentsLogModel.create(data);
    return comment;
  },
  async listComments({ filter, sort = { createdAt: -1 } }) {
    const comments = await CommentsLogModel.find(filter).sort(sort).lean();
    return comments;
  },

  async nonCustomerData({ filter }) {
    const nonCustomer = await User.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "customer_id",
          as: "PAYMENTS",
        },
      },
      {
        $match: {
          $expr: { $eq: [{ $size: "$PAYMENTS" }, 0] },
        },
      },
      {
        $project: {
          fullName: {
            $concat: [
              { $ifNull: ["$first_name", ""] },
              " ",
              { $ifNull: ["$last_name", ""] },
            ],
          },
          first_name: 1,
          last_name: 1,
          email: 1,
          PAYMENTS: 1,
          ENROLLED_COURSES: 1,
          picture: 1,
          phone: 1,
          is_active: 1,
          createdAt: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    return nonCustomer;
  },
};

module.exports = CustomerService;
