const AppConfig = require('../../../config/app.config');
const { NotFoundError, UnauthorizedError,ConflictError } = require('../../../errors/http/http.errors');
const { CommonLib } = require('../../../lib');
const { User, Plan, EnrolledCourse, Product } = require('../db/models');
const SanaService = require('../services/sana.service');
const UserService = {
    async createUser(userData) {
        try {
            if (userData.email) {
                userData.email = userData.email.toLowerCase().trim(); // Convert email to lowercase and trim spaces
            }
            return await User.create(userData);
        } catch (error) {
            if (error.code === 11000 && error.keyPattern?.email) {
                throw new ConflictError('Email already exists. Please use a different email.');
            }
            throw error; // Re-throw other errors
        }
    },
    async getUsers({ page, limit, searchQuery }) {
        // const where = {};
        const query = {is_deleted:false};
        let users = [];
        let offset;
        let pagination = null;
        if (searchQuery) {
            query.$or = [
                { email: { $regex: new RegExp(searchQuery, 'i') } }, // Case-insensitive email search
                {
                    $or: [
                        { first_name: { $regex: new RegExp(searchQuery, 'i') } },
                        { last_name: { $regex: new RegExp(searchQuery, 'i') } }
                    ]
                }
            ];
        }
        if (page && limit) {
            offset = CommonLib.getOffset(page, limit);
            const total = await User.countDocuments(query);
            pagination = CommonLib.getPagination(page, limit, total);
            users = await User.find(query).populate('corporate_enquiry_id', 'full_name').sort({ createdAt: -1 }).skip(offset).limit(limit);
        } else {
            users = await User.find(query).populate('corporate_enquiry_id', 'full_name').sort({ createdAt: -1 });
        }
        // Sanitize will be on the controller
        return { users, pagination };
    },
    async getUserByKeySet(data) {
        const where = {};
        const uniqueAuery = [];
        for (const key of AppConfig.registration_keys) {
            if (key.unique) {
                uniqueAuery.push({
                    [key.column_key]: data[key.post_key]
                });
                // This will use the and condition -> So skipping this one.
                // where[key.column_key] = data[key.post_key];
            }
        }
        if (uniqueAuery.length) {
            where['$or'] = uniqueAuery;
        }
        if (!CommonLib.isEmpty(where)) {
            return await User.findOne({ ...where, is_deleted : false });
        } else {
            return null;
        }
    },
    async getUserByUserId(userId, userIdCol = AppConfig.auth_user_keys) {
        const authType = AppConfig.auth_type.split("+")[1];
        const query = { is_deleted: '0' };
        const _query = [];
        if (Array.isArray(userIdCol)) {
            for (const key of userIdCol) {
                _query.push({ [key]: userId });
            }
        } else {
            query[userIdCol] = userId;
        }
        if (_query.length) {
            query['$or'] = _query;
        }
        const user = await User.findOne({
            ...query
        });
        return { user, authType };
    },
    async getUserById(userId) {
        const user = await User.findOne({ _id: userId }, { password: 0 }).populate('topic', 'name');
        return user;
    },
    async getUserForChangePass(userId) {
        const user = await User.findOne({ _id: userId });
        return user;
    },
    async getUserByEmail(email) {
        const user = await User.findOne({ email: email }, { password: 0 });
        return user;
    },
    async updatePassword(password, userId) {
        return await User.updateOne({ _id: userId }, { $set: { password: password } });
    },
    async updateMyProfile(id, profileData) {
       
        const user = await this.getUserById(id);
        if (!user) throw new NotFoundError('No user found with the id.');
    
        
        if (profileData.email) {
            const duplicateUser = await User.findOne({
                email: profileData.email,
                _id: { $ne: id }
            });
            if (duplicateUser) {
                throw new Error("Email Id already exists.");
            }
        }
    
        
        if (profileData.user_notify_email && Array.isArray(profileData.user_notify_email)) {
          
            const emails = profileData.user_notify_email
                .map(item => item.email)
                .filter(email => !!email);
    
            
            if (emails.length !== new Set(emails).size) {
                throw new Error("Email already exists.");
            }
            const phones = profileData.user_notify_email
            .map(item => item.phone ? item.phone.replace(/\s/g, '') : null)
            .filter(Boolean);
        if (phones.length !== new Set(phones).size) {
            throw new Error(" Phone numbers  already exists.");
        }
        }
    
      
        return await User.updateOne(
            { _id: id },
            { $set: profileData }
        );
    }
    ,
    async signUpOne(id, { first_name, last_name, password }) {
        const user = await this.getUserById(id);
        if (!user) throw new NotFoundError('No user found with the id.');
        return await User.updateOne({ _id: id }, { $set: { first_name, last_name, password } });
    },
    async signUpTwo(id, { work_place, current_role, responsibility, about_us }) {
        const user = await this.getUserById(id);
        if (!user) throw new NotFoundError('No user found with the id.');
        return await User.updateOne({ _id: id }, { $set: { work_place, current_role, responsibility, about_us } });
    },
    async signUpThree(id, { topic }) {
        const user = await this.getUserById(id);
        if (!user) throw new NotFoundError('No user found with the id.');
        return await User.updateOne({ _id: id }, { $set: { topic } });
    },
    async signUpFour(id, { product_news, data_updates }) {
        const user = await this.getUserById(id);
        if (!user._id.equals(id)) {
            throw new UnauthorizedError('Unauthorized User');
        }
        if (!user) throw new NotFoundError('No user found with the id.');
        return await User.updateOne({ _id: id }, { $set: { product_news, data_updates, user_signup_step_done:true } });
    },

    async signUpFive(id, { name, price, description, plan_id }) {
        const user = await this.getUserById(id);
        if (!user) throw new NotFoundError('No user found with the id.');
        // Insert a new plan into the PlanModel
        const newPlan = await Plan.create({
            name,
            price,
            description,
            user_id: id,
            subscription_plan_id : plan_id
        });

        return {
            message: 'plan Saved',
            plan: newPlan,
        };
    },
    async updateUser(userId, updatedDetails) {
        try {
            const Useredit = await User.findByIdAndUpdate(userId, updatedDetails, { new: true });
            if (!Useredit) {
                throw new Error('User not found.');
            }

            return Useredit;
        } catch (error) {
            throw error;
        }
    },
    async getPlan(userId) {
        try {
            // Step 1: Find the latest plan with is_free_plan: false
            let plan = await Plan.findOne({
                user_id: userId,
                is_free_plan: false,
                is_deleted: false, // Exclude deleted plans
            })
                .sort({ subscription_date: -1 }) // Sort by subscription_date in descending order
                .exec();



            // Step 2: If no plan found, fetch the latest plan with is_free_plan: true
            if (!plan) {
                plan = await Plan.findOne({
                    user_id: userId,
                    is_free_plan: true,
                    is_deleted: false, // Exclude deleted plans
                })
                    .sort({ subscription_date: -1 }) // Sort by subscription_date in descending order
                    .exec();
            }

            // Step 3: Throw an error if no plan is found
            if (!plan) {
                throw new Error('No plan found for the given user.');
            }
            return plan; // Return the found plan (null if no plan exists)
        } catch (error) {
            console.error('Error fetching the latest plan:', error);
            throw error; // Re-throw the error for proper error handling
        }
    },


    async getActivePlan(userId) {
        try {
            // Step 1: Find the latest plan with is_free_plan: false
            let plan = await Plan.findOne({
                user_id: userId,
                is_free_plan: false,
                is_deleted: false, // Exclude deleted plans
            })
                .sort({ subscription_date: -1 }) // Sort by subscription_date in descending order
                .exec();
            return plan; // Return the found plan (null if no plan exists)
        } catch (error) {
            console.error('Error fetching the latest plan:', error);
            throw error; // Re-throw the error for proper error handling
        }
    },


    async findOrCreateUser(firstName, lastName, email) {
        try {
            // Normalize email to lowercase for consistent comparison
            const normalizedEmail = email.toLowerCase();
    
            // Check if a user with the given email already exists
            const existingUser = await User.findOne({ email: normalizedEmail });
    
            if (existingUser) {
                //console.log('User already exists:', existingUser);
                return existingUser; // Return the existing user
            }
    
            // If no user exists, create a new user
            const newUser = new User({
                first_name: firstName,
                last_name: lastName,
                email: normalizedEmail,
                user_type: ['guest_user'], // Default user type
                is_guest:true,
                user_signup_step_done:true
            });
    
            await newUser.save(); // Save the user to the database
            //console.log('New user created:', newUser);
            return newUser; // Return the newly created user
        } catch (error) {
            console.error('Error in find Or Create User:', error);
            throw error; // Rethrow the error for handling by the caller
        }
    },


    async addCorpUser(users, courses, enquiryId) {
        try {
            // Ensure users is always an array
            users = Array.isArray(users) ? users : [users];
    
            // Ensure courses is always an array
            courses = Array.isArray(courses) ? courses : [courses];
    
            if (users.length === 0) {
                throw new Error("Users array is required");
            }
    
            if (courses.length === 0) {
                throw new Error("Courses array is required");
            }
    
            if (!enquiryId) {
                throw new Error("Enquiry Id required");
            }
    
            const createdUsers = [];
    
            for (const userData of users) {
                const { first_name, last_name, email ,corporate_user} = userData;
    
                // Normalize email to lowercase for consistency
                const normalizedEmail = email.toLowerCase();
    
                // Check if user already exists
                let user = await User.findOne({ email: normalizedEmail });
    
                if (!user) {
                    user = new User({
                        first_name,
                        last_name,
                        email: normalizedEmail,
                        corporate_enquiry_id: enquiryId,
                        user_signup_step_done:true,
                         user_type: "corporate_user"
                    });
                }
                await user.save();
    
                // Enroll user in courses
                const enrolledCourses = await Promise.all(
                    courses.map(async (courseId) => {
                        const product = await Product.findOne({ _id: courseId });
                        
                        if (product && product.plan_duration) {
                            const subscriptionDate = new Date(); // Current date
                            const durationInMonths = product.plan_duration; // Duration in months
                            
                            // Calculate subscription_end_date by adding months
                            const subscriptionEndDate = new Date(subscriptionDate);
                            subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + durationInMonths);
    
                            return await EnrolledCourse.create({
                                userId: user._id,
                                courseId: courseId,
                                subscription_date: subscriptionDate,
                                subscription_end_date: subscriptionEndDate,
                            });
                        }
                        return null; // Return null if no plan_duration
                    })
                );
    
                // Remove null values from enrolledCourses
                const newEnrolledCourses = enrolledCourses.filter(course => course !== null);
                
                console.log('Enrolled courses:', newEnrolledCourses);
    
                // // Send user data to SanaService
                // const sana = await SanaService.createSana({
                //     email, 
                //     firstName: user.first_name, 
                //     lastName: user.last_name, 
                //     courseId: courses, 
                //     sanaUserId: user.sana_user_id
                // });
    
                createdUsers.push(user);
            }
    
            return { message: "Users added successfully", users: createdUsers };
    
        } catch (error) {
            throw error;
        }
    },
    
    async getUserUpdate(userId,data){
        const user = await User.findByIdAndUpdate(userId, data, { new: true });
        if (!user) {
            throw new Error('user not found.');
        }
        return user;
    },



    async getUserPlan({ userId, page, limit }) {
        if (!userId) {
            throw new UnprocessableEntityError('UserId required.');
        }
        let plan;
        if (page && limit) {
            const offset = (page - 1) * limit;

            // Fetch recently viewed courses with pagination
            plan = await Plan.find({ user_id: userId,
                is_free_plan: false,
                is_deleted: false })
                .sort({ subscription_date: -1 }) 
                .skip(offset)
                .limit(Number(limit));

        } else {
            plan = await Plan.find({ user_id: userId,
                is_free_plan: false,
                is_deleted: false })
            .sort({ subscription_date: -1 }) 
        }

        const total = await Plan.countDocuments({ user_id:userId,is_free_plan: false, is_deleted: false }); // Total number of records

        const pagination = CommonLib.getPagination(page, limit, total);

        return {
            plan,
            pagination: page && limit ? pagination : null,
        };
    },
   
    async deleteUser(userId) {
        try {
            const deletedUser = await User.findByIdAndDelete(userId);
            if (!deletedUser) {
                throw new NotFoundError('User not found');
            }
            return deletedUser;
        } catch (error) {
            throw error;
        }
    },
    
};

module.exports = UserService;