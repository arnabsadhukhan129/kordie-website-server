const { SubscriptionPlanModel, Payment, Plan } = require("../db/models");

const SubscriptionPlanService = {
  async createSubscriptionPlan(data) {
    const subscriptionData = (
      await SubscriptionPlanModel.create(data)
    ).toJSON();
    return subscriptionData;
  },

  async getAllSubscriptionPlan({
    index,
    size,
    sort = { createdAt: 1 },
    filter,
  }) {
    const query = SubscriptionPlanModel.find(filter).sort(sort);
    if (index >= 0 && size) {
      query.skip(index).limit(size);
    }
    const subscriptions = await query.lean();
    const count = await SubscriptionPlanModel.countDocuments({
      ...filter,
    });
    return { subscriptions, count };
  },

  async getOneSubsciptionPlan(filter) {
    return await SubscriptionPlanModel.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "products", // change this if your collection name is different
          localField: "courseIds", // field in your subscription plan that holds the array of course IDs
          foreignField: "_id", // field in the product collection to match against
          as: "products", // output array field containing matching products
        },
      },
    ]);
  },

  async updatePlan({ filter, updateOptions }) {
    const result = await SubscriptionPlanModel.updateOne(filter, {
      $set: updateOptions,
    });
    return result;
  },

  async userAssociatedWithPlan({ filter, limit, index, searchFilter = {} }) {
    const plans = await Plan.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                first_name: 1,
                last_name: 1,
                email: 1,
                phone: 1,
                fullName: {
                  $concat: [
                    { $ifNull: ["$first_name", ""] },
                    " ",
                    { $ifNull: ["$last_name", ""] },
                  ],
                },
              },
            },
          ],
          as: "USER",
        },
      },
      {
        $unwind: {
          path: "$USER",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match : searchFilter
      },
      {
        $skip: index,
      },
      {
        $limit: limit,
      },
    ]);
    const count = await Plan.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                first_name: 1,
                last_name: 1,
                email: 1,
                phone: 1,
                fullName: {
                  $concat: [
                    { $ifNull: ["$first_name", ""] },
                    " ",
                    { $ifNull: ["$last_name", ""] },
                  ],
                },
              },
            },
          ],
          as: "USER",
        },
      },
      {
        $unwind: {
          path: "$USER",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match : searchFilter
      },
      { $count: "total" },
    ]);
    return { plans, count: count[0]?.total || 0 };
  },

  async updateUserAssociatedPlan({filter, updateOptions}){
    return await Plan.updateOne(filter, {
      $set: updateOptions,
    });
  }
};

module.exports = SubscriptionPlanService;
