const { NotFoundError,BadRequestError } = require('../../../errors/http/http.errors');
const { Payment,User,Plan,EnrolledCourse } = require('../db/models');
const SanaService = require('../services/sana.service');
const NotificationService = require('../services/notification.service');
const { CommonLib } = require('../../../lib');
const { default: mongoose } = require('mongoose');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Load Stripe with secret key

const PaymentService = {
  async createCheckoutSession(data) {
    try {
      const { productName, productDescription, productDiscount, price, duration, customerId, subscriptionPlanId } = data;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: productName,
                description: productDescription,
              },
              unit_amount: Math.round(price * 100), // Convert dollars to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.APP_FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_FRONTEND_URL}/payment/cancel`,
        metadata: {
          customerId: customerId,
          subscriptionPlanId: subscriptionPlanId,
          productName: productName,
          productDescription: productDescription,
          productDiscount: productDiscount,
          duration:duration,
        },
      });

      return session;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },


  async createUserCheckoutSession(data) {
    try {
      const { productName, productDescription, productDiscount, price, duration, customerId, subscriptionPlanId } = data;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: productName,
                description: productDescription,
              },
              unit_amount: Math.round(price * 100), // Convert dollars to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.APP_FRONTEND_URL}/userAccount/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_FRONTEND_URL}/userAccount/cancel`,
        metadata: {
          customerId: customerId,
          subscriptionPlanId: subscriptionPlanId,
          productName: productName,
          productDescription: productDescription,
          productDiscount: productDiscount,
          duration:duration
        },
      });

      return session;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },


  async createCourseCheckoutGuestSession(data) {
    try {
      const { firstname,lastname, email, productName,
        productDescription,
        price,
        customerId,
        courseId,
        duration,
        sanaUserId,
        sanaCourseId } = data;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: productName,
                description: productDescription,
              },
              unit_amount: Math.round(price * 100), // Convert dollars to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.APP_FRONTEND_URL}/guestCheckout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_FRONTEND_URL}/guestCheckout/cancel`,
        metadata: {
          customerId: customerId,
          courseId: courseId,
          productName: productName,
          productDescription: productDescription,
          duration:duration,
          sanaUserId:sanaUserId,
          sanaCourseId:sanaCourseId,
          firstname,lastname, email
        },
      });

      return session;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },


  async createCourseCheckoutSession(data) {
    try {
      const { firstname,lastname, email, productName,
        productDescription,
        price,
        customerId,
        courseId,
        duration,
        sanaUserId,
        sanaCourseId,discountAmount,
        priceAfterDiscount } = data;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: productName,
                description: productDescription,
              },
              unit_amount: Math.round(priceAfterDiscount * 100), // Convert dollars to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.APP_FRONTEND_URL}/coursePurchase/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_FRONTEND_URL}/coursePurchase/cancel`,
        metadata: {
          customerId: customerId,
          courseId: courseId,
          productName: productName,
          productDescription: productDescription,
          duration:duration,
          sanaUserId:sanaUserId,
          sanaCourseId:sanaCourseId,
          firstname,lastname, email,discountAmount,
          priceAfterDiscount,
          priceBeforeDiscount:price
        },
      });

      return session;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },

  async processStripeWebhook(rawBody, sig){
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    try {
        const event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
        // console.log('Webhook event:', event.data.object);
        const cardCustomerDetais = event?.data?.object?.customer_details || {};
        const metadata = event?.data?.object?.metadata || {};
        console.log('Customer Details:', cardCustomerDetais, metadata);
        let customer = await User.findOne({ 
          $or: [
            { _id: new mongoose.Types.ObjectId(metadata?.id)},
            { email: cardCustomerDetais.email }
          ] 
        });
        
        if(!metadata.customerId && !customer){
          customer = await User.create({
            email : cardCustomerDetais.email,
          })
        }
        event.data.object.metadata = {
          ...metadata,
          customerId: customer?._id ,
          email: customer?.email,
        }
        // Check for the event type
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            // ✅ Check if payment already exists in DB
            const existingPayment = await Payment.findOne({ session_id: session.id });
            console.log('Existing Payment:', existingPayment);
            if (existingPayment) {
                console.log('Duplicate webhook event. Skipping...');
                return { success: true, message: 'Duplicate event' };
            }
            // Log metadata for debugging
            // console.log("Session Metadata:", session);

            // Retrieve line items associated with the session
            // const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
            // let itemDetails = [];

            // lineItems.data.forEach(item => {
            //     // Store item details in a variable
            //     itemDetails.push({
            //         name: item.description, // Stripe places the name under the description
            //         quantity: item.quantity,
            //         amount: (item.amount_total / 100).toFixed(2), // Convert amount to dollars
            //         currency: item.currency,
            //     });
            // });
            const customer_id = session.metadata?.customerId
            const product_name = session.metadata?.productName
            const product_description = session.metadata?.productDescription
            const price =  session.amount_total/100
            const subcription_plan_id = session.metadata?.subscriptionPlanId
            const course_id =  session.metadata?.courseId
            const discount = session.metadata?.productDiscount
            const duration = session.metadata?.duration
            const sana_user_id = session.metadata?.sanaUserId
            const sana_course_id = session.metadata?.sanaCourseId
            const firstname = session.metadata?.firstname
            const lastname = session.metadata?.lastname
            const email = session.metadata?.email
            const discount_amount = session.metadata?.discountAmount
            const price_after_discount = session.metadata?.priceAfterDiscount
            const price_before_discount = session.metadata?.priceBeforeDiscount
            const payment_method_type = session.payment_method_types[0];

            
        if (subcription_plan_id && customer_id) { 
          const subscriptionDate = new Date(); // Current date
          const durationInMonths = Number(duration) || 12;// Duration in months (e.g., 12 months for 1 year)
          
          // Calculate subscription_end_date by adding the duration in months
          const subscriptionEndDate = new Date(subscriptionDate);
          subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + durationInMonths);
      
          const newPlan = await Plan.create({
              name: product_name,
              description: product_description,
              discount,
              price,
              user_id: customer_id,
              subscription_date: subscriptionDate,
              subscription_end_date: subscriptionEndDate, // Set the end date
              is_free_plan: false,
              subscription_plan_id: subcription_plan_id,
          });

          // Create a new payment instance
          await Payment.create({
            session_id: session.id,
            status: 'success',
            customer_id: customer_id,
            product_name: product_name,
            price: price,
            subcription_plan_id: subcription_plan_id,
            course_id: course_id,
            paid_amount: price,
            payment_method_type
        });

        const user = await User.findById(customer_id);
        if(user){
          const messagePayload = {
            first_name:user?.first_name || 'User',
            plan_name: product_name,
            payment_received: price,
            start_date: subscriptionDate,
            end_date: subscriptionEndDate,
            discount:discount
          };
          await NotificationService.sendNotification(user.email, messagePayload, 'subscription_plan').then(r =>{console.log(r);}).catch(err => {console.log(err);}); 
        }
        
        }


        if (course_id && customer_id && !discount && !discount_amount) {  console.log("webhook 1");
          const subscriptionDate = new Date(); // Current date
          const durationInMonths = Number(duration) || 12; // Duration in months (e.g., 12 months for 1 year)
          
          // Calculate subscription_end_date by adding the duration in months
          const subscriptionEndDate = new Date(subscriptionDate);
          subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + durationInMonths);

          const newEnrolledCourse = await EnrolledCourse.create({
            userId: customer_id,
            courseId: course_id,
            subscription_date: subscriptionDate,
            subscription_end_date: subscriptionEndDate, // Set the end date
          });
          // Create a new payment instance
           const payment =await Payment.create({
            session_id: session.id,
            status: 'success',
            customer_id: customer_id,
            product_name: product_name,
            price: price,
            course_id: course_id,
            paid_amount: price,
            payment_method_type
        });
        const sana = await SanaService.createSana({ email, firstName:firstname, lastName:lastname, courseId:sana_course_id, sanaUserId:sana_user_id })

        const user = await User.findById(customer_id);
        if(user){
          const messagePayload = {
            first_name:user?.first_name || 'User',
            plan_name: product_name,
            payment_received: price,
            start_date: subscriptionDate,
            end_date: subscriptionEndDate,
          };
        await NotificationService.sendNotification(user.email, messagePayload, 'course_plan').then(r =>{console.log(r);}).catch(err => {console.log(err);}); 
        }
      }



        if (course_id && customer_id && price_after_discount && price_before_discount && discount_amount) { console.log("webhook 2");
          const subscriptionDate = new Date(); // Current date
          const durationInMonths = Number(duration) || 12;
          
          // Calculate subscription_end_date by adding the duration in months
          const subscriptionEndDate = new Date(subscriptionDate);
          subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + durationInMonths);

          const newEnrolledCourse = await EnrolledCourse.create({
            userId: customer_id,
            courseId: course_id,
            subscription_date: subscriptionDate,
            subscription_end_date: subscriptionEndDate, // Set the end date
          });
          // Create a new payment instance
           const payment =await Payment.create({
            session_id: session.id,
            status: 'success',
            customer_id: customer_id,
            product_name: product_name,
            price: price_before_discount,
            course_id: course_id,
            paid_amount: price,
            discount_amount:discount_amount,
            payment_method_type
        });
        console.log(email, firstname, lastname, sana_course_id, sana_user_id,  "webhook 2");
        const sana = await SanaService.createSana({ email, firstName:firstname, lastName:lastname, courseId:sana_course_id, sanaUserId:sana_user_id })

         const user = await User.findById(customer_id);
         if(user){
           const messagePayload = {
             first_name:user?.first_name || 'User',
             plan_name: product_name,
             payment_received: price,
             start_date: subscriptionDate,
             end_date: subscriptionEndDate,
            };
           await NotificationService.sendNotification(user.email, messagePayload, 'course_plan').then(r =>{console.log(r);}).catch(err => {console.log(err);}); 
         }
        }
        }
      return { success: true, message: 'Event processed successfully' };
    } catch (error) {
      console.log(error,"error");
        throw new Error(`Webhook error: ${error.message}`);
    }
 },



 async getPayment(userId, page = 1, limit = 10, product_name, sortBy) {
  try {
    
    const skip = (Number(page) - 1) * Number(limit);

    const query = {
      customer_id: userId,
      is_deleted: false,
    };

    if (product_name) {
      query.product_name = { $regex: product_name, $options: "i" };
    }

    const sortCriteria = sortBy ? sortBy : { purchase_date: -1 };

    const payments = await Payment.find(query)
      .populate('subcription_plan_id', 'name price')
      .populate('course_id', 'name description')
      .sort(sortCriteria)
      .skip(skip)
      .limit(Number(limit))
      .exec();

    // Get the total count for pagination
    const total = await Payment.countDocuments(query);

    // Generate pagination object using your CommonLib helper
    const pagination = CommonLib.getPagination(page, limit, total);

    return {
      payments,
      pagination,
    };
  } catch (error) {
    console.error('Error fetching the payments:', error);
    throw error;
  }
},



async getAdminPayment({ page, limit, product_name, sortBy }) {
  try {
      const query = {
          is_deleted: false,  // Exclude deleted payments
      };

      if (product_name) query.product_name = { $regex: new RegExp(product_name, 'i') };

      // Define sorting options
      const sortOptions = {
          '1': { purchase_date: 1 },  // Oldest first
          '2': { purchase_date: -1 }, // Newest first
          '3': { amount: 1 },         // Lowest amount first
          '4': { amount: -1 },        // Highest amount first
      };

      const sort = sortOptions[sortBy] || { purchase_date: -1 }; // Default sort by newest

      // Get total count of matching documents
      const total = await Payment.countDocuments(query);

      let payments;
      if (page && limit) {
          const offset = (page - 1) * limit;
          payments = await Payment.find(query)
              .sort(sort)
              .skip(offset)
              .limit(Number(limit))
              .populate('subcription_plan_id', 'plan_name') // Populate subscription plan details
              .populate('course_id', 'course_name')     // Populate course details
              .populate('customer_id', 'first_name last_name email') // Populate customer details
              .exec(); // Execute the query
      } else {
          payments = await Payment.find(query)
              .sort(sort)
              .populate('subcription_plan_id', 'plan_name') // Populate subscription plan details
              .populate('course_id', 'course_name')     // Populate course details
              .populate('customer_id', 'first_name last_name email') // Populate customer details
              .exec(); // Execute the query
      }

      // payments = payments.filter(payment => payment.customer_id); 

      // Generate pagination metadata
      const pagination = CommonLib.getPagination(page, limit, total);

      return {
          payments,
          pagination,
      };
  } catch (error) {
      console.error('Error fetching admin payments:', error);
      throw error; // Re-throw the error for proper error handling
  }
}




 
 
};

module.exports = PaymentService;

