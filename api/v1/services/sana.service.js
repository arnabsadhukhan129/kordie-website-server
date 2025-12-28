const axios = require('axios');
const AppConfig = require('../../../config/app.config');
const { NotFoundError } = require('../../../errors/http/http.errors');
const { CommonLib } = require('../../../lib');
const { User } = require('../db/models');
const qs = require('qs');
const SanaService = {
    BASE_URL: process.env.SANA_BASE_URL,
    TOKEN_URL: process.env.SANA_TOKEN_URL,
    CLIENT_ID: process.env.SANA_CLIENT_ID,
    CLIENT_SECRET: process.env.SANA_CLIENT_SECRET,
    SCOPES: process.env.SANA_SCOPES,

    async getToken() {
        try {
            const response = await axios.post(
                this.TOKEN_URL,
                qs.stringify({
                    grant_type: 'client_credentials',
                    client_id: this.CLIENT_ID,
                    client_secret: this.CLIENT_SECRET,
                    scope: this.SCOPES,
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );
            return response.data.data.accessToken;
        } catch (error) {
            console.error('Error fetching token:', {
                message: error.response?.data?.error?.message || error.message,
                details: error.response?.data || 'No additional details available',
            });
            throw new Error('Failed to fetch authentication token.');
        }
    },

    // Create a user, send an invite, and assign a course
    async createSana(data) {
        const { email, firstName, lastName, courseId, sanaUserId} = data;

        // if (!email || !firstName || !lastName || !courseId) {
        //     throw new Error('Missing required fields: email, firstName, lastName, or courseId.');
        // }
        if (!email || !courseId) {
            throw new Error('Missing required fields: email or courseId.');
        }

        try {
            const token = await this.getToken();
            console.log('sanaUserId:', sanaUserId);
            let userId = ""
            if(!sanaUserId){
            // Step 1: Create user
            const createUserResponse = await axios.post(
                `${this.BASE_URL}/users`,
                {
                    user: {
                        email,
                        firstName,
                        lastName,
                        language: 'en',
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            userId = createUserResponse.data.data.id;
            console.log('User created:', userId);

            
            const updatedUser = await User.findOneAndUpdate(
                { email }, // Query to find the user by email
                { $set: { sana_user_id: userId } }, // Update operation
                { new: true, runValidators: true } // Options
            );
    
            if (updatedUser) {
                console.log('User updated successfully:', updatedUser);
            } else {
                console.log('User not found with the provided email.');
            }

                        // Step 2: Send invite
                        await axios.post(
                            `${this.BASE_URL}/users/${userId}/send-invite`,
                            {},
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        console.log('Invite sent to user:', userId);

            }
            if(sanaUserId){
                userId = sanaUserId
            }
            

            // Ensure courseId is always an array
           const courseIds = Array.isArray(courseId) ? courseId : [courseId];

            // Format courses for batch assignment
            const assignments = courseIds.map(id => ({ type: 'course', id }));

            // Step 3: Assign course
            await axios.post(
                `${this.BASE_URL}/users/${userId}/assignments`,
                {
                    //assignments: [{ type: 'course', id: courseId }],
                    assignments
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return {
                message: 'User created, invite sent, and course assigned successfully.',
                userId,
            };
        } catch (error) {
            console.error('Error processing user:', error.response?.data || error.message);
            throw new Error('An error occurred while processing the user.');
        }
    },


    async getSanaCourses() {
        try {
            const token = await this.getToken();

            // Step 1: Fetch courses
            const response = await axios.get(
                `${this.BASE_URL}/courses`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Step 2: Group courses by tags
            const groupedCourses = this.groupCoursesByTags(response.data.data);
            return groupedCourses;
        } catch (error) {
            console.error('Error fetching courses:', error.message);
            throw error;
        }
    },

    // Helper function to group courses by tags
    groupCoursesByTags(courses) {
        const groupedCourses = {};
        // Filter courses to include only those with the "featured" tag
        const featuredCourses = courses.filter(course => course.tags.includes('featured'));
        featuredCourses.forEach((course) => {
            course.tags.forEach((tag) => {
                // Skip adding the "featured" tag to the grouped result
                if (tag === 'featured') {
                    return;
                }
                if (!groupedCourses[tag]) {
                    groupedCourses[tag] = [];
                }
                groupedCourses[tag].push(course);
            });
        });

        return groupedCourses;
    },



    async getSanaAllCourses(limit = 10, next = null) {
        try {
            const token = await this.getToken();
    
            // Step 1: Fetch courses with query parameters
            const params = {
                limit,
                next,
            };
    
            const response = await axios.get(
                `${this.BASE_URL}/courses`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params, // Add query parameters
                }
            );
           return response.data;
        } catch (error) {
            console.error('Error fetching courses:', error.message);
            throw error;
        }
    },


    async getSanaSingleCourse(courseId) {
        try {
            const token = await this.getToken();
    
            // Make an API call to fetch the course by ID
            const response = await axios.get(
                `${this.BASE_URL}/courses/${courseId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            return response.data; // Return the course data
        } catch (error) {
            console.error('Error fetching single course:', error.message);
            throw error;
        }
    }
    
    
    
};

module.exports = SanaService;
