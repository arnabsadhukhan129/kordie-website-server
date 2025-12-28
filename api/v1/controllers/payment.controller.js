const { PaymentService, UserService } = require('../services');
const {ConflictError, NotFoundError, BadRequestError, ForbiddenError, UnprocessableEntityError} = require('../../../errors/http/http.errors');
const { Payment,User,Plan,EnrolledCourse } = require('../db/models');
const PaymentController = {
    async createCheckoutSession(req, res, next) {
      try {
        const { productName, productDescription, productDiscount, price, duration, subscriptionPlanId } = req.body;
        let customerId = req.user._id;
        // Validate required fields
        if (!productName || !price || !customerId || !duration || !subscriptionPlanId) {
          throw new UnprocessableEntityError('Missing required fields. Please provide productName, price, duration, customerId, and subscriptionPlanId.');
        }

      // Check if productDiscount and duration are numeric
      if (isNaN(productDiscount) || isNaN(duration)) {
        throw new UnprocessableEntityError('Invalid input. Both product discount and duration must be numeric.');
         
      }

      //for active plan check under user
      const plan = await Plan.findOne({
        user_id: customerId,
        is_free_plan: false,
        is_deleted: false, // Exclude deleted plans
      })
        .sort({ subscription_date: -1 }) 
        .exec();

      // if (plan) {
      //     const currentDate = new Date();
      //     if (plan.subscription_end_date && plan.subscription_end_date > currentDate) {
      //       throw new UnprocessableEntityError('Active plan already exists' );
      //     }
      // }
    
        const session = await PaymentService.createCheckoutSession({
          productName,
          productDescription,
          price,
          customerId,
          subscriptionPlanId,
          productDiscount,
          duration
        });
  
        res.status(200).json({ sessionId: session.id, url: session.url });
      } catch (error) {
        next(error);
      }
    },


    async createUserCheckoutSession(req, res, next) {
      try {
        const { productName, productDescription, productDiscount, price, duration, subscriptionPlanId } = req.body;
        let customerId = req.user._id;
        // Validate required fields
         if (!productName || !price || !customerId || !duration || !subscriptionPlanId) {
          throw new UnprocessableEntityError('Missing required fields. Please provide productName, price, duration, customerId, and subscriptionPlanId.');
        }

      // Check if productDiscount and duration are numeric
      if (isNaN(productDiscount) || isNaN(duration)) {
        throw new UnprocessableEntityError('Invalid input. Both product discount and duration must be numeric.');
         
      }

       //for active plan check under user
       const plan = await Plan.findOne({
        user_id: customerId,
        is_free_plan: false,
        is_deleted: false, // Exclude deleted plans
      })
        .sort({ subscription_date: -1 }) 
        .exec();

      // if (plan) {
      //     const currentDate = new Date();
      //     if (plan.subscription_end_date && plan.subscription_end_date > currentDate) {
      //       throw new UnprocessableEntityError('Active plan already exists' );
      //     }
      // }

        const session = await PaymentService.createUserCheckoutSession({
          productName,
          productDescription,
          price,
          customerId,
          subscriptionPlanId,
          productDiscount,
          duration
        });
  
        res.status(200).json({ sessionId: session.id, url: session.url });
      } catch (error) {
        next(error);
      }
    },

    async createGuestUserPlanCheckoutSession(req, res, next) {
      try {
        const { productName, productDescription, productDiscount, price, duration, subscriptionPlanId } = req.body;
        let customerId = req?.user?._id || "";
        // Validate required fields
         if (!productName || !price || !duration || !subscriptionPlanId) {
          throw new UnprocessableEntityError('Missing required fields. Please provide productName, price, duration, customerId, and subscriptionPlanId.');
        }

      // Check if productDiscount and duration are numeric
      if (isNaN(productDiscount) || isNaN(duration)) {
        throw new UnprocessableEntityError('Invalid input. Both product discount and duration must be numeric.');  
      }

        const session = await PaymentService.createUserCheckoutSession({
          productName,
          productDescription,
          price,
          customerId,
          subscriptionPlanId,
          productDiscount,
          duration
        });
  
        res.status(200).json({ sessionId: session.id, url: session.url });
      } catch (error) {
        next(error);
      }
    },

    async createCourseCheckoutGuestSession(req, res, next) {
      try {
        const { firstname,lastname, email, productName, productDescription, price, duration, courseId, sanaCourseId } = req.body;
        if (!email ) {
          throw new UnprocessableEntityError('Missing required fields. Please provide email.');
        }
        let customerId;
        let sanaUserId;
        // const exitsuser = await UserService.getUserByEmail(email);
        // if (exitsuser) {
        //     //customerId = user._id.toString();
        //     throw new UnprocessableEntityError('User already exits, please login your account');
        // } 
        
        const user = await UserService.findOrCreateUser(firstname,lastname, email);
        if (user) {
          customerId = user._id.toString();
          sanaUserId = user.sana_user_id;
        } 
        

        const existingSubscription = await EnrolledCourse.findOne({ userId:customerId, courseId });

        if (existingSubscription) {
            const currentDate = new Date();
            if (existingSubscription.subscription_end_date && existingSubscription.subscription_end_date > currentDate) {
              throw new UnprocessableEntityError('Course already active' );
            }
        }
        
         // Validate required fields
         if (!productName || !productDescription || !price || !duration || !courseId || !sanaCourseId|| !customerId) {
          throw new UnprocessableEntityError('Missing required fields. Please provide productName, productDescription, price, duration sanaCourseId, customerId and courseId.');
        }

      // Check if productDiscount and duration are numeric
      if (isNaN(duration) || isNaN(price)) {
        throw new UnprocessableEntityError('Invalid input product price and duration must be numeric.');
      }
      const session = await PaymentService.createCourseCheckoutGuestSession({
          firstname,lastname,email,
          productName,
          productDescription,
          price,
          customerId,
          courseId,
          duration,
          sanaUserId,
          sanaCourseId
        });
  
        res.status(200).json({ sessionId: session.id, url: session.url });
      } catch (error) {
        next(error);
      }
    },




    async createCourseCheckoutSession(req, res, next) {
      try {
        const { productName, productDescription, price, duration, courseId, sanaCourseId, discountAmount, priceAfterDiscount} = req.body;
        let customerId;
        let sanaUserId;
        let firstname,lastname,email;
        const user = await UserService.getUserById(req.user._id);
        if (user) {
          customerId = user._id.toString();
          sanaUserId = user.sana_user_id;
          firstname = user?.first_name;
          lastname = user?.last_name;
          email = user.email;
        } 
        
        const existingSubscription = await EnrolledCourse.findOne({ userId:customerId, courseId });

        if (existingSubscription) {
            const currentDate = new Date();
            if (existingSubscription.subscription_end_date && existingSubscription.subscription_end_date > currentDate) {
              throw new UnprocessableEntityError('Course already active' );
            }
        }
        
         // Validate required fields
         if (
          !productName || !productDescription || !price || !duration || !courseId ||
          // !sanaCourseId||
           !customerId || !discountAmount || !priceAfterDiscount) {
          throw new UnprocessableEntityError('Missing required fields. Please provide productName, productDescription, price, duration sanaCourseId, customerId, discountAmount, priceAfterDiscount and courseId.');
        }

      // Check if productDiscount and duration are numeric
      if (isNaN(duration) || isNaN(price)) {
        throw new UnprocessableEntityError('Invalid input product price and duration must be numeric.');
      }


      const session = await PaymentService.createCourseCheckoutSession({
          firstname,lastname,email,
          productName,
          productDescription,
          price,
          customerId,
          courseId,
          duration,
          sanaUserId,
          sanaCourseId,
          discountAmount,
          priceAfterDiscount
        });
  
        res.status(200).json({ sessionId: session.id, url: session.url });
      } catch (error) {
        next(error);
      }
    },


    async handleWebhook(req, res, next){
        const sig = req.headers['stripe-signature'];
        try {
          console.log("Webhook received:", req.body);
            // Pass raw body and signature to the service
            await PaymentService.processStripeWebhook(req.body, sig);
            res.status(200).send('Webhook received successfully');
        } catch (error) {
            console.error("Webhook Error:", error);
            //res.status(400).send(`Webhook error: ${error.message}`);
            next(error);
        }
    },


    
    async getPayment(req, res, next) {
      try {
        const { page = 1, limit = 10, product_name, sortBy } = req.query;
        
        const result = await PaymentService.getPayment(
          req.user._id,
          page,
          limit,
          product_name,
          sortBy
        );
        
        next(result);
      } catch (error) {
        next(error);
      }
    },


    async getAdminPayment(req, res, next) {
      try {
              const { page, limit, product_name, sortBy} = req.query;
              const result = await PaymentService.getAdminPayment({ page, limit, product_name, sortBy });
              next(result);
      } catch (error) {
          next(error);
      }
    },


  };
  
module.exports = PaymentController;
