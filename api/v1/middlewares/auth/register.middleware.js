const AppConfig = require('../../../../config/app.config');
const UserService = require('../../services/user.service');
const { UnprocessableEntityError, ForbiddenError, ConflictError } = require('../../../../errors/http/http.errors');
const { StringLib } = require('../../../../lib');
const { CustomerService } = require('../../services');
const RegisterMiddleware = {
    async addPassword(req, res, next){
        if (!req.body.password) {
            const password = StringLib.generateRandomStrings(8);
            req.body.password = req.body.confirm_password = password;
          }
          next();
    },
    async validateRegister(req, res, next) {
        const keySets = AppConfig.registration_keys;
        const data = req.body;
        for(let i = 0; i < keySets.length; i++) {
            const keyData = keySets[i];
            if(keyData.required && !data[keyData.post_key]) {
                return next({error: true, code: 422, message: `required${keyData.post_key}`});
            }
        }
        next();
    },
    async checkUniqueIntigrity(req, res, next) {
        const user = await UserService.getUserByKeySet(req.body);
        if(user && !user.user_type.includes('guest_user') ) {
            next({error: true, code: 409, message: `User already exists`});
            return;
        }
        next();
    },

    async signUpOne(req, res, next) {
        try {
            const { first_name, last_name, password, confirm_password } = req.body;
            if(!first_name) throw new UnprocessableEntityError('Please provide first name.');
            if(!last_name) throw new UnprocessableEntityError('Please provide last name.');
            if(!password) throw new UnprocessableEntityError('Please provide password.');
            if(!confirm_password) throw new UnprocessableEntityError('Please provide confirm password');
            if(password !== confirm_password) {
                throw new UnprocessableEntityError('Password and confirm password not match');
            }
            
            // Proceed to the next middleware if validation passes
            next();
        } catch (e) {
            next(e); // Pass the error to the error-handling middleware
        }
    },

    async signUpTwo(req, res, next) {
        try {
            const { work_place, current_role, responsibility, about_us } = req.body;
            // if(!work_place) throw new UnprocessableEntityError('Work place not provided.');
            if(!current_role) throw new UnprocessableEntityError('Current role not provided.');
            // if(!responsibility) throw new UnprocessableEntityError('Responsibility not provided.');
            if(!about_us) throw new UnprocessableEntityError('We’d love to know how you heard about us — please fill this in');
            // Proceed to the next middleware if validation passes
            next();
        } catch (e) {
            next(e); // Pass the error to the error-handling middleware
        }
    },

    async emailCheckOnUpdate(req, res, next) {
        try {
          const body = req.body;
          if (body.email) {
            const user = await CustomerService.getOneCustomer({ email: body.email, is_deleted:false });
            if (
              user &&
              user._id.toString() !== req.user._id &&
              user._id.toString() !== body.customer_id
            ) {
              throw new ConflictError(
                `User with email ${body.email} already exists.`
              );
            }
          }
          next();
        } catch (e) {
          next(e);
        }
      },
};
module.exports = RegisterMiddleware;