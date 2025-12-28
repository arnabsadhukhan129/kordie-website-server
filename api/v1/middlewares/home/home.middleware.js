const AppConfig = require('../../../../config/app.config');
const UserService = require('../../services/user.service');
const { UnprocessableEntityError, ForbiddenError } = require('../../../../errors/http/http.errors');

const HomeMiddleware = {
  async isCorrect(req, res, next) {
    try {
      const allowedTypes = ["admin", "product_manager", "sub_admin"];
      console.log("User type:", req.user.user_type);
      if (
        Array.isArray(req.user.user_type) &&
        req.user.user_type.some(type => allowedTypes.includes(type))
      ) {
        next();
      } else if (
        allowedTypes.includes(req.user.user_type)
      ) {
        next();
      } else {
        throw new ForbiddenError('User is not valid for this route.');
      }
    } catch (e) {
      next(e);
    }
  },

    async isCourseUserDiscount(req, res, next) {
      try {
        const userType = req.user?.user_type;
        // Check if the user is public or has user_type "user"
        console.log("User type:", req.user);
        if (
          !userType || // Allow public users (no user_type present)
          (Array.isArray(userType) && userType.includes("user")) // Allow users with "user" in user_type
        ) {
          const udiscount = await UserService.getActivePlan(req.user?._id); // Fetch active plan if applicable
          if(udiscount){
            req.user.discount = udiscount.discount;
          }
          console.log("User discount:", udiscount);
          next();
        } else if (Array.isArray(userType) && userType.includes("admin")) {
          // Allow users with "admin" in user_type
          next();
        } else {
          // Handle other cases or restrict access
          next();
        }
      } catch (e) {
        next(e);
      }
    },
    

    validateUpdate(req, res, next) {
      try {
          const firstname = req.body.firstname;
          const email = req.body.email;
          const message = req.body.message;
        
          if(!firstname) throw new UnprocessableEntityError('Firstname not provided.');
          if(!email) throw new UnprocessableEntityError('Email not provided.');
          // if(!message) throw new UnprocessableEntityError('Message not provided.');
          
          next();
      } catch(e) {
          next(e);
      }
  },
  };
  
  module.exports = HomeMiddleware;
  


