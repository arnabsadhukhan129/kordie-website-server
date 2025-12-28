const mongoose = require('mongoose');
const AppConfig = require('../../../config/app.config');
const { StringLib, security, DateLib } = require('../../../lib');
const UserService = require('./user.service');
const { User, Product, Session, Topic } = require('../db/models');
const Models = require('../db/models');
const { NotFoundError, InternalServerError } = require('../../../errors/http/http.errors');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config(); // To load environment variables
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const axios = require('axios');
module.exports = {
    login(authData) {
        
    },
    async findAdmin(username) {
        const AdminModel = Models[AppConfig.admin_model || 'User'];
        if(!AdminModel) throw new InternalServerError('No model defined.');
        const admin = await AdminModel.findOne({
            email: username
        }).lean();
        console.log(admin, username);
        return admin;
    },
    async getOpenSessionOfUser(userId) {
        return await Session.findOne({
            user_id: userId,
            logout_time: null
        });
    },
    async getSession(sessionId) {
        return Session.findOne({
            session_id: sessionId
        });
    },
    async logoutSession(sessionId, expiryTime = null) {
        const session = await Session.findOne({session_id: sessionId});
        if(!session) {
            throw new NotFoundError("No active session found");
        }
        session.logout_time = expiryTime || new Date();
        return await session.save();
    },
    async invalidateOlderSession(userId) {
        await Session.updateMany({user_id: new mongoose.Schema.Types.ObjectId(userId)}, {$set:{expiry_time: new Date()}});
    },
    async createSessionFromUserId(userId) {
        const user = await UserService.getUserById(userId);
        if(!user) throw new NotFoundError('No User Found!');
        const userData = user.toJSON();
        for(const key of AppConfig.auth_user_excluded_cols) {
            delete userData[key];
        }
        return await this.createSessionForUser(userData);
    },
    async createSessionForUser(user) {
        /**
         * 1. Generate a session id
         * 2. Generate the access token and refresh token
         * 3. Create a session payload
         * 4. Save the session
         * 5. Return the user, session, accesstoken and refresh token
         */
        // Generate the session id
        const sessionId = `${StringLib.generateRandomStrings(4).toUpperCase()}-${StringLib.generateRandomStrings(3).toUpperCase()}-${StringLib.generateRandomStrings(4).toUpperCase()}`;
        user.sessionId = sessionId;
        // generate the accesstoken and refresh token
        const accessToken = security.generateAccessToken(user);
        const refreshToken = security.generateRefreshToken(user);
        // create session payload
        const sessionPayload = {
            session_id: sessionId,
            access_token: accessToken,
            refresh_token: refreshToken,
            user_id: user._id,
            login_time: new Date(),
            expiry_time: DateLib.modifyAKADate(new Date(), `+${process.env.AUTH_ACCESS_TOKEN_EXP_TIME}`)
        };
        // save the session
        const sessionRes = await Session.create(sessionPayload);
        // remove the session id as we dont need it in the frontend
        delete user.sessionId;
        return {
            user,
            accessToken,
            refreshToken
        };
    },

    async socialLogin(data) {
        const { user } = data;
      
        if (!user) {
          throw new Error('User data is missing');
        }
      
        const {
          given_name: first_name,
          family_name: last_name,
          email,
          sub,
          nickname,
          picture,
        } = user;
      
        if (!sub || !email ) {
          throw new Error('Need to allow or share email from your social login');
        }
      
        // Determine social type from the `sub` field
        const socialType = sub.split('|')[0];
        if (!['google-oauth2', 'windowslive', 'linkedin', 'apple'].includes(socialType)) {
          throw new Error('Unsupported social login type');
        }
      
        const socialId = sub.split('|')[1];
        const loginTime = new Date(); // Capture login time
      
        // Find the user by email
        let userRecord = await User.findOne({ email }, { password: 0 });
      
        if (userRecord) {
          // Update social ID fields if necessary
          const socialFieldMapping = {
            'google-oauth2': 'googleId',
            windowslive: 'microsoftId',
            linkedin: 'linkedinId',
            apple: 'appleId'
          };

          const socialTimeMapping = {
            'google-oauth2': 'googleTime',
            windowslive: 'microsoftTime',
            linkedin: 'linkedinTime',
            apple: 'appleTime'
          };
      
          const socialIdField = socialFieldMapping[socialType];
          const socialTimeField = socialTimeMapping[socialType];
          
          if (!userRecord[socialIdField]) {
             userRecord[socialIdField] = socialId; // Update missing social ID
             userRecord[socialTimeField] = loginTime;
          }
      
          // Update other fields
          userRecord.first_name = userRecord.first_name || first_name?first_name:nickname;
          userRecord.last_name = userRecord.last_name || last_name;
          //userRecord.picture = picture || userRecord.picture; 
          userRecord.socialType = socialType; // Update the last social type used
          
      
          await userRecord.save();
        } else {
            const socialFieldMapping = {
                'google-oauth2': 'googleId',
                windowslive: 'microsoftId',
                linkedin: 'linkedinId',
                apple: 'appleId'
              };
              const socialTimeMapping = {
                'google-oauth2': 'googleTime',
                windowslive: 'microsoftTime',
                linkedin: 'linkedinTime',
                apple: 'appleTime'
              };
              const socialIdField = socialFieldMapping[socialType];
              const socialTimeField = socialTimeMapping[socialType];

          // If the user does not exist, create a new one
          // Avoid updating the picture for Microsoft and Apple logins
          let userPicture = picture;
          if (socialType === 'windowslive' || socialType === 'apple') {
              userPicture = "";  // Do not update the picture for these social types
          }
          // If the user does not exist, create a new one
          userRecord = await UserService.createUser({
            email,
            [socialIdField]: socialId,
            [socialTimeField]:loginTime,
            user_type:"user",
            socialType,
            first_name: first_name?first_name:nickname,
            last_name,
            picture:userPicture,
            is_validated:true
            });
        }

          const uData = userRecord.toJSON();
          const response = await this.createSessionForUser(uData);
          return response;
    },

    async adminDashboard(){
      const userno = {
        active_count : await User.countDocuments({ is_active : true, is_deleted:false }),
        inactive_count : await User.countDocuments({ is_active : false, is_deleted:false }),
      }
      const courseno = {
        active_count : await Product.countDocuments({ is_active : true, is_deleted:false }),
        inactive_count : await Product.countDocuments({ is_active : false, is_deleted:false }),
      }
      chapterno = {
        active_count : await Topic.countDocuments({ is_active : true, is_deleted:false }),
        inactive_count : await Topic.countDocuments({ is_active : false, is_deleted:false }),
      }
      return {userno, courseno, chapterno};
    }
  };