const {AuthService, UserService, OtpService, NotificationService} = require('../services');
const AppConfig = require('../../../config/app.config');
const EnumConfig = require('../../../config/enum.config');
const { security, envs, CommonLib } = require('../../../lib');
const {ConflictError, NotFoundError, BadRequestError, ForbiddenError, UnprocessableEntityError} = require('../../../errors/http/http.errors');
const AuthController = {
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     * @returns {Promise<void>}
     */
    async register(req, res, next) {
        /**
         * 1. Get the data from the body
         * 2. Determine the auth type
         * 3. Based on that call the service
         */
        try {
            const registerData = req.body;
            console.log(registerData.user_type)
            //This is for fontend user register to block user type admin fillup, this cause may be security concern that's why delete user_type here if user put admin
            if (registerData.user_type && registerData.user_type.includes("admin")){ delete registerData.user_type }
            const authType = AppConfig.auth_type.split("+").pop();
            // check if the user already exist with the unique key sets
            // This is done in the middleware
            //  const existingUser = await UserService.getUserByKeySet(registerData);
            //  if(existingUser) {
            //      // User with the unique keys already exist
            //      throw new ConflictError("userExist");
            //  }
            // create the user with the keys
            const userData = {};
            for(const key of AppConfig.registration_keys) {
                 if(!key.skip) {
                    if(key.post_key === AppConfig.auth_password_key) {
                       // hash the password
                        if(registerData[key.post_key])
                        userData[key.column_key] = security.hashPassword(registerData[key.post_key]);
                    } else {
                        // Assiging the default if no value is provided.
                        // This is ok as the required value are guarded through middleware
                        userData[key.column_key] = registerData[key.post_key] || key.default;
                    }
                 }
            }
            let userRes ={};
            const guestUser = await UserService.getUserByEmail(userData.email);
            if(guestUser && guestUser.user_type.includes('guest_user')) {
                userRes = await UserService.getUserUpdate(guestUser._id, userData)
            }
            else {
                userRes = await UserService.createUser(userData);
            }
             const user = userRes.toJSON();
             
            if(authType === 'otp') {
                // Otp flow
                // send otp to the user
                const otp = await OtpService.sendOtp(user[AppConfig.auth_primary_userid], 
                    'auth_registration', {name: user.name});
                const otpres = await OtpService.createOtp(otp, user._id, 'auth_registration');
                user.otp_token = otpres.token_id;
                // create token if required
                // send the response
                next({
                    token: otpres.token_id
                });
            } else {
                 // Password flow
                /**
                 * 1. Create the token and send the response
                 */
                if(!AppConfig.verify_register && AppConfig.login_after_registration) {
                    for(const key of AppConfig.auth_user_excluded_cols) {
                        delete user[key];
                    }
                    const session = await AuthService.createSessionForUser(user);
                    next({...session, login_flow: true});
                } else {
                    // check if any verification method available
                    if(AppConfig.verify_register) {
                        if(AppConfig.verify_register_method === 'otp') {
                            const otp = await OtpService.sendOtp(user[AppConfig.auth_primary_userid], 
                                'auth_registration_verify', {name: userRes.fullName || "User"}); 
                            const otpres = await OtpService.createOtp(otp, user._id, 'auth_registration_verify');
                            user.otp_token = otpres.token_id;
                            next({
                                token: otpres.token_id
                            });
                        } else {
                            // TODO handle other verification method
                        }
                    } else {
                        next({login_flow: false});
                    }
                }
            }
        }catch(e) {
            next(e);
        }
    },

    //FOR CREATING ADMIN 
    async registerAdmin(req, res, next) {
        try {
            const registerData = req.body;
            
            // Allowed roles for this registration
            const allowedRoles = ['admin', 'sub_admin', 'product_manager'];
            
            // Ensure user_type is provided and valid.
            if (!registerData.user_type) {
                throw new UnprocessableEntityError('user_type is required');
            }
            
            // If user_type is an array, check that at least one allowed role is present.
            if (Array.isArray(registerData.user_type)) {
                if (!registerData.user_type.some(role => allowedRoles.includes(role))) {
                    throw new UnprocessableEntityError('Invalid user_type provided');
                }
            } else {
                // If it's a string, verify it directly.
                if (!allowedRoles.includes(registerData.user_type)) {
                    throw new UnprocessableEntityError('Invalid user_type provided');
                }
            }
    
            // Build userData based on registration keys defined in AppConfig.
            const userData = {};
            for (const key of AppConfig.registration_keys) {
                if (!key.skip) {
                    if (key.post_key === AppConfig.auth_password_key) {
                        // Hash the password
                        if (registerData[key.post_key])
                            userData[key.column_key] = security.hashPassword(registerData[key.post_key]);
                    } else {
                        // Assign provided value or default if not present.
                        userData[key.column_key] = registerData[key.post_key] || key.default;
                    }
                }
            }
            
            // Explicitly assign the allowed user_type from the request.
            userData.user_type = registerData.user_type;
    
            // Create the user record.
            const userRes = await UserService.createUser(userData);
            const user = userRes.toJSON();
    
            // Directly create a session for the new user (no OTP verification).
            const session = await AuthService.createSessionForUser(user);
    
            // Optionally, remove any sensitive or excluded columns.
            for (const key of AppConfig.auth_user_excluded_cols) {
                delete user[key];
            }
            
            // Return the session details with an indicator that this was a direct login flow.
            next({ ...session, login_flow: true });
        } catch (e) {
            next(e);
        }
    },
    

    async login(req, res, next) {
        try {
            const authData = req.body;
            const userid = authData[AppConfig.auth_user_id_key];
            const password = authData[AppConfig.auth_password_key];
            // user id fetch the user
            const user = await UserService.getUserByUserId(userid);
            console.log("user....",user);
            if(!user.user) {
                throw new UnprocessableEntityError("User name or password wrong");
            }
            if(!user.user.is_active){
                throw new UnprocessableEntityError("Username is Blocked by Admin");
            }
            // CHECK IF USER NOT YET VERIFIED
            // if(!user.user?.is_validated){
                
            //     // GET THE OTP TOKEN FOR THAT USER WHICH IS NOT INVALID
            //     const otp_token = await OtpService.validToken(user.user?._id)
            //     console.log(otp_token)
            //     const tokenData = {
            //         token: otp_token?.token_id
            //     }
            //     return next({verified:false, tokenData})
            // }
            // check if the app has single session per user enabled
            if(AppConfig.auth_single_session) {
                // check if the user has an open session
                const session = await AuthService.getOpenSessionOfUser(user.user._id);
                if(session) {
                    // There is an ongoing session
                    if(AppConfig.auth_single_session_auto_logout) {
                        await AuthService.invalidateOlderSession(user.user._id);
                    } else {
                        // check if the session has expired
                        const expiryTime = new Date(Date.parse(session.expiry_time));
                        const date = new Date();
                        if(date.getTime() < expiryTime.getTime()) {
                            // session expiry time is in the future
                            if(AppConfig.throw_error_on_single_session) {
                                throw new ConflictError("one Session Conflict");
                            }
                        }
                        // Logout
                        // As if the session is not expired or the session is old. then logout and create new session
                        await AuthService.logoutSession(session.session_id, expiryTime);
                    }
                }
            }
            let responseData = {};
            if(user.authType === 'otp') {
                /**
                 * 1. Send OTP
                 */
                const otp = await OtpService.sendOtp(userid, 'auth_login');
                const otpres = await OtpService.createOtp(otp, user.user._id || 1, 'auth_login');
                responseData = {
                    token: otpres.token_id
                };
            } else {
              // Password

              if (
                !user.user.user_type.includes("user") &&
                !user.user.user_type.includes("corporate_user")
              ) {
                throw new UnprocessableEntityError(
                  "User login invalid credentails"
                );
              }
              if (user.user.password !== security.hashPassword(password)) {
                throw new UnprocessableEntityError(
                  "User name or password wrong"
                );
              }
              const uData = user.user.toJSON();
              for (const key of AppConfig.auth_user_excluded_cols) {
                delete uData[key];
              }
              const payload = await AuthService.createSessionForUser(uData);
              payload.user = {}
              responseData = payload;
            }

            next(responseData);
        }catch(e) {
            next(e);
        }
    },


    async loginotp(req, res, next) {
        try {
            const authData = req.body;
            const userid = authData[AppConfig.auth_user_id_key];
            // user id fetch the user
            const user = await UserService.getUserByUserId(userid);
            console.log("USERRRRRRRRRRRRR=========>>>",user)
            if(!user.user) {
                throw new UnprocessableEntityError("User does not exist");
            }
            if(!user.user.is_active) {
                throw new UnprocessableEntityError("Username is Blocked by Admin");
            }
            if (!user.user.user_type.includes('corporate_user') && !user.user.user_type.includes('user')) {
                throw new UnprocessableEntityError('User login invalid credentails');
            };
            let responseData = {};
            const otp = await OtpService.sendOtp(userid, 'auth_login');
            const otpres = await OtpService.createOtp(otp, user.user._id || 1, 'auth_login');
            responseData = {
                    token: otpres.token_id,
                    user_type: user.user.user_type
            };
            
            next(responseData);
        }catch(e) {
            next(e);
        }
    },

    async verifyOtp(req, res, next) {
        try {
            const otp = req.body.otp;
            //const otp_phone = req.body.otp_phone;
            const token = req.body.token;
            // With the token get the details
            const otpres = await OtpService.getOtpByTokenId(token);
            if(!otpres) throw new ForbiddenError('Opps! Invalid OTP Session. Please resend and try again.');
            
            if(otpres.otp_invalidate !== EnumConfig.OTP_INVALIDATE.VALID) { // usage: OTP verified if verified once then user needs to resend otp again
                throw new ForbiddenError("Opps! Looks like it is not permitted by the system.");
            }

            // check if the otp is expired or not
            const expTime = new Date(Date.parse(otpres.exp_time));
            if(expTime.getTime() < new Date().getTime()) {
                throw new ForbiddenError("OTP expired.");
            }
            if(otp.toString() !== otpres.otp) {
                throw new BadRequestError("OTP did not match.");
            }
            // if(otp_phone && otp_phone.toString() !== otpres.otp_phone) {
            //     throw new BadRequestError("Phone OTP did not match.");
            // }
            // update the otp to invalidate
            await OtpService.invalidateOtp(otpres._id);
            const payload = await OtpService.getResponseBasedOnOtpTrigger(otpres);
            next(payload);
        } catch(e) {
            // console.log(e);
            next(e);
        }
    },

    async resendOtp(req, res, next) {
        try {
            // const token = req.body.refresh_token;
            const token = req.body.token;
            //const email_login = req.body.email_login;
            // validate get the details from the token
            if(!token) throw new ForbiddenError('Token invalid');
            // Check if the otp token is invalid or not
            // this way we can determine to mark the refresh token a invalid
            const otpData = await OtpService.getOtpByTokenId(token);
            //if(!otpData || otpData.otp_invalidate !== EnumConfig.OTP_INVALIDATE.VALID) throw new ForbiddenError('Invalid session token');
            // invalidate the otp
            await OtpService.invalidateOtp(otpData._id);
            const reason = otpData.reason;
            // get the user details
            const user = await UserService.getUserById(otpData.user_id);
            if(!user) throw new ForbiddenError('Invalid User Session');

            const serializedUser = user.toJSON();  // converts it into plain JS object from mongoose object
            // send otp
           //let otp_phone="";
           // console.log(email_login,"kkkkkkk",reason)
            const otp = await OtpService.sendOtp(serializedUser[AppConfig.auth_primary_userid], reason, {name: `${serializedUser.first_name || "User"}` });
            // if(!email_login){
            //     // console.log(email_login,"mmmm")
            //  otp_phone = await OtpService.sendOtp(serializedUser[AppConfig.auth_secondary_userid], reason, {name: `${serializedUser.first_name}`});
            // }
            // create otp
            const otpRes = await OtpService.createOtp(otp, serializedUser._id, reason);
            // console.log(otpRes)
            // generate the access token
            const msg ='OTP sent to your email id, please check your email.'
            next({
                token: otpRes.token_id,
                msg
            });
        } catch(e) {
            console.log(e);
            next(e);
        }
    },
    async logout(req, res, next) {
        /**
         * 1. Get the session id
         */
        await AuthService.logoutSession(req.user.sessionId);
        next({message: 'Logout Successfully'});
    },
    async adminLogin(req, res, next) {
        try {
            const username = req.body.username;
            const password = req.body.password;
            const admin = await AuthService.findAdmin(username);
            if (!admin) throw new UnprocessableEntityError('Login Invalid Creds');
    
            if (admin.password !== security.hashPassword(password)) {
                throw new UnprocessableEntityError('Login Invalid Creds');
            }
    
            // Allowed roles
            const allowedRoles = ['admin', 'sub_admin', 'product_manager'];
            // Check if admin.user_type is an array and contains at least one allowed role
            if (!Array.isArray(admin.user_type) || !admin.user_type.some(role => allowedRoles.includes(role))) {
                throw new UnprocessableEntityError('Login Invalid Creds');
            }
    
            // Create the session
            const session = await AuthService.createSessionForUser(admin);
            next(session);
        } catch (e) {
            next(e);
        }
    }
    ,
    async myProfile(req, res, next) {
        try {
            const user = await UserService.getUserById(req.user._id);
            next(user);
        } catch(e) {
            next(e);
        }
    },
    async updateMyProfile(req, res, next) {
        try {
            const userId = req.user._id;
            const data = req.body;
    
            await UserService.updateMyProfile(userId, {
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
            });
            next({ message: "Profile Updated Successfully" });
        } catch (e) {
            next(e);
        }
    },
    
    async changePassword(req, res, next) {
        try {
            const userId = req.user._id;
            const newPassword = req.body.new_password;
            await UserService.updatePassword(security.hashPassword(newPassword), userId);
            next({message: "Password Changed Successfully"});
        } catch(e) {
            next(e);
        }
    },
    /**
     * Forget password flow
     * 1. Forget password API -> get the phone or email, send the email or sms with otp if otp flow is selected
     * otherwise send the link.
     * 2. Verify OTP API if otp flow selected  -> return a token for change password with user id
     * 3. Verify the token for the change password and change or update the password
     */
    /**
     * 
     *
     * @return {Promise<void>}
     */
    async forgetPassword(req, res, next) {
        try {
            const userid = req.body[AppConfig.auth_user_id_key];
            const forgetPasswordFlow = AppConfig.forget_password_flow;
            // get the user
            const data = await UserService.getUserByUserId(userid, 
                AppConfig.forget_password_primary_userid || AppConfig.auth_primary_userid);
            if(!data.user) {
                throw new NotFoundError('No User Found');   
            }
            const user = data.user;
            if(forgetPasswordFlow === 'otp') {
                const otp = await OtpService.sendOtp(userid, 'auth_forget_password_otp', {NAME: user.fullName});
                const otpres = await OtpService.createOtp(otp, user._id, 'auth_forget_password_otp');
                return next({
                    token: otpres.token_id
                });
            } else {
                // generate the link token
                const token = security.encrypt(JSON.stringify({_id: user._id + '', timestamp: Date.now()}));
                // const url = `${envs.getFrontEndUrl()}/${process.env.APP_Reset_PASSWORD_KEY}/` + token;
                let url = `${envs.getFrontEndUrl()}/${process.env.APP_FRONTEND_RESET_PASSWORD_KEY}?`+token;
                if (
                    user.user_type &&
                    (
                      user.user_type.includes("admin") ||
                      user.user_type.includes("product_manager") ||
                      user.user_type.includes("sub_admin")
                    )
                  ) {
                    url = `${process.env.FontendURL}/#/${process.env.APP_Reset_PASSWORD_KEY}/` + token;
                  }
                // create the payload
                const messagePayload = {
                    link: url
                };
                NotificationService.sendNotification(userid, messagePayload, 'auth_forget_password_link').then(r =>{console.log(r);}).catch(err => {console.log(err);});
                next({token: token});
            }
        } catch(e) {
            next(e);
        }
    },
    async resetPassword(req, res, next) {
        try {
            const userId = req.body.user_id;
            const password = req.body.new_password;
            await UserService.updatePassword(security.hashPassword(password), userId);
            next({message: 'Password Changed Successfully'});
        } catch(e) {
            next(e);
        }
    },

    async signUpOne(req, res, next) {
        try {
            const userId = req.user._id;
            const { first_name, last_name, password } = req.body;
            // Call service to create user
            const user = await UserService.signUpOne(userId, {first_name: first_name, last_name: last_name, password:security.hashPassword(password)});
            const message= 'User Step One SignUp Successfully';
            next({
                user,
                message
            });
        } catch (error) {
            next(error); // Pass error to error-handling middleware
        }
    },

    async signUpTwo(req, res, next) {
        try {
            const userId = req.user._id;
            const { work_place, current_role, responsibility, about_us } = req.body;
            // Call service to create user
            const user = await UserService.signUpTwo(userId, { work_place, current_role, responsibility, about_us });
            const message= 'User Step Two SignUp Successfully';
            next({
                user,
                message
            });
        } catch (error) {
            next(error); // Pass error to error-handling middleware
        }
    },

    async signUpThree(req, res, next) {
        try {
            const userId = req.user._id;
            let { topic } = req.body;
            if(!topic) throw new UnprocessableEntityError('Topic Not Provided.');

            // Normalize topic to always be an array
            if (!Array.isArray(topic)) {
                topic = [topic]; // Convert single value to an array
            }
            // Call service to create user
            const user = await UserService.signUpThree(userId, { topic });
            const message= 'User Step Three SignUp Successfully';
            next({
                user,
                message
            });
        } catch (error) {
            next(error); // Pass error to error-handling middleware
        }
    },

    async signUpFour(req, res, next) {
        try {
            const userId = req.user._id;
            const { product_news, data_updates } = req.body;
            // Call service to create user
            const user = await UserService.signUpFour(userId, { product_news, data_updates });
            const message= 'User Step Four SignUp Successfully';
            next({
                user,
                message
            });
        } catch (error) {
            next(error); // Pass error to error-handling middleware
        }
    },

    async signUpFive(req, res, next) {
        try {
            const userId = req.user._id;
            const {name, price, description, plan_id } = req.body;
            if(!plan_id || !CommonLib.isValidObjectId(plan_id)){
                throw new UnprocessableEntityError('Invalid Plan Selected. Please contact support');
            }
            // Call service to create user
            const user = await UserService.signUpFive(userId, {name, price, description, plan_id });
            const message= 'User Step Five SignUp Successfully';
            next({
                user,
                message
            });
        } catch (error) {
            next(error); // Pass error to error-handling middleware
        }
    },

    async socialLogin(req, res, next) {
        try {
          const user = await AuthService.socialLogin(req.body);
          next(user)
         } catch (error) {
            next(error);
        }
    },

    async adminDashboard(req, res, next){
        try {
            const response = await AuthService.adminDashboard();
            next(response);
        }
        catch(error){
            next(error);
        }
    }

};

module.exports = AuthController;