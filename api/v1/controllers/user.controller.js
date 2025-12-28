const AppConfig = require("../../../config/app.config");
const { UnprocessableEntityError } = require("../../../errors/http/http.errors");
const { CommonLib } = require("../../../lib");
const {UserService} = require("../services");

const UserController = {
    async createUser(req, res, next) {
        try {
            const data = req.body;
            const payload = {};
            for(let i = 0; i < AppConfig.registration_keys.length; i++) {
                const keyData = AppConfig.registration_keys[i];
                if(!keyData.skip) {
                    if(!data[keyData.post_key] && keyData.default) payload[keyData.column_key || keyData.post_key] = keyData.default;
                    if(data[keyData.post_key]) payload[keyData.column_key || keyData.post_key] = data[keyData.post_key]; 
                }
            }
            if(CommonLib.isEmpty(payload)) {
                throw new UnprocessableEntityError('notValidUserData');
            }
            const user = await UserService.createUser(payload);
            next(user);
        } catch(e) {
            next(e);
        }
    },
    async updateUser(req, res, next) {

    },
    async listUser(req, res, next) {
        const users = await UserService.getUsers({
            page: parseInt(req.query.page) || 0,
            limit: parseInt(req.query.limit) || 0,
            searchQuery: req.query.keyword,
        });
        next({users: users.users.map(u => u.toJSON()), pagination: users.pagination});
    },
    async getUser(req, res, next) {
        try {
            const result = await UserService.getUserById(req.params.id);
            next(result);
        } catch (error) {
            next(error);
        }
    },
    async deleteUser(req, res, next) {
        try {
            const deletedUser = await UserService.deleteUser(req.params.id);
            next(deletedUser);
        } catch (error) {
            next(error);
        }
    },
        // GET SINGLE Plan
        async getPlan(req, res, next) {
            try {
                const result = await UserService.getPlan(req.user._id);
                next(result);
            } catch (error) {
                next(error);
            }
        },


                // GET SINGLE Plan
                async getUserPlan(req, res, next) {
                    try {
                        const userId = req.params.id;
                        const { page, limit} = req.query;
                        const result = await UserService.getUserPlan({ userId, page, limit });
                        next(result);
                    } catch (error) {
                        next(error);
                    }
                },

        async addCorpUser(req, res, next){
            try{
                const { users, courses, enquiryId ,corporate_user} = req.body; 
                const result = await UserService.addCorpUser(users, courses, enquiryId,corporate_user);
                next(result);
            } catch (error) {
                next(error);
            }
        },

        async getUserUpdate(req, res, next) {
            try {
                const data = req.body;
                const result = await UserService.getUserUpdate(req.params.id,{
                    first_name: data.first_name,
                    last_name: data.last_name,
                    phone: data.phone,
                    shortbio: data.shortbio,
                    linkedin: data.linkedin,
                    twitter: data.twitter,
                    goal: data.goal,
                    learn_from_kordie: data.learn_from_kordie,
                    language: data.language,
                    location: data.location,
                    timezone: data.timezone,
                    work_place: data.work_place,
                    current_role: data.current_role,
                    topic:data.topic,
                    picture:data.picture,
                    notify_email:data.notify_email,
                    user_notify_email: data.user_notify_email, 
                    promotion_tips: data.promotion_tips,
                    account_updates: data.account_updates,
                    user_type:data.user_type
                });
                next(result);
            } catch (error) {
                next(error);
            }
        },
};

module.exports = UserController;