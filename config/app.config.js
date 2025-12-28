const path = require('path');
const AppConfig = {
    base_path: path.resolve(__dirname, '..'),
    /**
     * Possible values
     * 
     * email+password
     * 
     * phone+password
     * 
     * email-otp
     * 
     * phone+otp
     * 
     * userid+password
     */
    auth_type: 'email+password',
    auth_user_id_key: 'email',
    auth_user_keys: ['email', 'phone'],
    /** This will be used to get the value from the body of the request.
     * Will be ignored if you use the auth_type with otp combination
     */
    portal_define_key : "portal",
    auth_password_key: 'password',
    is_registration_enabled: true,
    is_frontend_auth_enabled: true,
    /**
     * This is for user registeration API body validation and database operation.
     * if you need any key to add or remove you can do it from here.
     * 
     * But for other APIs that you create you can directly use the key in the validator like the old fashioned way.
     * No need to create like this.
     * 
     * This is only for reusability. But for your new API reusibility is not required.
     */
    registration_keys: [
        { post_key: 'first_name', column_key: 'first_name', required: false },
        { post_key: 'last_name', column_key: 'last_name', required: false },
        { post_key: 'email', column_key: 'email', required: true, unique: true },
        { post_key: 'phone', column_key: 'phone', required: false},
        { post_key: 'password', column_key: 'password', required: false },
        { post_key: 'confirm_password', column_key: '', required: false, skip: true },
        { post_key: 'user_type', column_key: 'user_type', required: false, default: 'user' }
    ],

    payment_keys : [
        { post_key: 'session_id', column_key: 'session_id', required: false, message_name : "Session Id" },
        { post_key: 'status', column_key: 'status', required: false , message_name : "Status"},
        { post_key: 'customer_id', column_key: 'customer_id', required: true, message_name : "Customer" },
        { post_key: 'price', column_key: 'price', required: false, message_name : "Price" },
        { post_key: 'discount_amount', column_key: 'discount_amount', required: false, message_name : "Discount Amount" },
        {post_key : 'paid_amount', column_key: 'paid_amount', required: false, message_name : 'Paid Amount'},
        {post_key : 'payment_method_type', column_key: 'payment_method_type', required: false, message_name : 'Payment Method Type'},
    ],

    plan_keys : [
        { post_key: 'product_name', column_key: 'name', required: true,},
        { post_key: 'price', column_key: 'price', required: true,},
        { post_key: 'description', column_key: 'description', required: true,},
        { post_key: 'discount_amount', column_key: 'discount', required: true,},
        { post_key: 'customer_id', column_key: 'user_id', required: true,},
        { post_key: 'subscription_plan_id', column_key: 'subscription_plan_id', required: true,},
    ],

    subscription_model_keys: [
        { post_key: 'plan_name', column_key: 'plan_name', required: true, message_name : "Plan Name", can_update : true },
        { post_key: 'slug', column_key: 'slug', required: false, can_update : false },
        { post_key: 'discount', column_key: 'discount', required: false, can_update : true},
        { post_key: 'sub_title', column_key: 'sub_title', required: false, can_update : true },
        { post_key: 'details', column_key: 'details', required: false, can_update : true },
        //{ post_key: 'validity_period', column_key: 'validity_period', message_name : "validity_period", required: true, can_update : true },
        // { post_key: 'validity_unit', column_key: 'validity_unit', required: false, can_update : true},
        { post_key: 'tag', column_key: 'tag', required: false, can_update : true},
        { post_key: 'price', column_key: 'price', required: false, can_update : true},
        { post_key: 'special_note', column_key: 'special_note', required: false, can_update : true },
        { post_key: 'is_membership', column_key: 'is_membership', required: false, can_update : true },
    ],

    course_enrollment_for_teams_model_keys: [
        { post_key: 'full_name', column_key: 'full_name', required: true, message_name : "Full Name", can_update : true },
        { post_key: 'email', column_key: 'email', required: true, can_update : true , message_name : "Email ID",},
        { post_key: 'linkedin', column_key: 'linkedin', required: false , can_update : true, message_name : "Linkedin Address",},
        { post_key: 'company', column_key: 'company', required: true, can_update : true , message_name : "Company Name",},
        { post_key: 'messageDetails', column_key: 'messageDetails', required: false, can_update : true },

        { post_key: 'totalAmount', column_key: 'totalAmount', required: false, can_update : true },
        { post_key: 'discount', column_key: 'discount', required: false, can_update : true },
        { post_key: 'paidAmount', column_key: 'paidAmount', required: false, can_update : true },
        { post_key: 'amountToBePaid', column_key: 'amountToBePaid', required: false, can_update : true },
        { post_key: 'paymentStatus', column_key: 'paymentStatus', required: false, can_update : true },
    ],

    enrolled_course_keys : [
        { post_key: 'courseId', column_key: 'courseId', required: true, message_name : "Course Idetifier"},
        { post_key: 'userId', column_key: 'userId', required: false, message_name : "User Idetifier"},
        { post_key: 'subscription_date', column_key: 'subscription_date', required: true, message_name : "Subscription Date"},
        { post_key: 'subscription_end_date', column_key: 'subscription_end_date', required:true, message_name : "Subscription End Date"},
    ],

    name_keys: ['first_name', 'last_name'],
    auth_primary_userid: 'email',
    auth_secondary_userid: 'phone',
    forget_password_primary_userid: 'email',
    auth_unique_keys: ['email', 'phone'],
    login_after_registration: true,
    verify_register: true,
    verify_register_method: 'otp',
    otp_length: 6,
    test_otp: 123456,
    otp_alpha_numeric: false,
    template_path: '/templates',
    auth_token_initial_text: 'Bearer',
    auth_token_separator: ' ',
    auth_token_key: 'authorization',
    /**
     * Auth single session to check if the new session is to be created or not.
     */
    auth_single_session: false,
    /**
     * Flag to check if the auth_single_session activated
     * then if this is true then older session will be logedout and a new session will be created
     * If false then an error will be thrown and no new login will be allowed.
     */
    auth_single_session_auto_logout: false,
    throw_error_on_single_session: false,
    // Flag to enable the password hash
    // if true then password will be stored as hashed provided with the hash algorithm
    hash_password: true,
    /** The algorithm to use for all the hash. If omitted then the default SHA-256 will be used  */
    hash_algo: 'sha256',

    forget_password_flow: 'link', // otp | link 

    /** Array of column names of the user table
    // that should be excluded in the generation of acces token and refresh token
    // As well as exclude from the response of register and login */
    auth_user_excluded_cols: [
        'password',
        'createdAt',
        'updatedAt'
    ],
    /** Provide the model name used for the admin table if any.
    if omitted then User will be used */
    admin_model: 'User',
    skip_auth: [
        { path: '/auth/login/?', method: 'POST' },
        { path: '/auth/social-login/?', method: 'POST' },
        { path: '/auth/login-otp/?', method: 'POST' },
        { path: '/auth/register/?', method: 'POST' },
        { path: '/auth/resend-otp/?', method: 'POST' },
        { path: '/auth/verify-otp/?', method: 'POST' },
        { path: '/auth/forget-password/?', method: 'POST' },
        { path: '/auth/reset-password/?', method: 'POST' },
        { path: '/auth/admin/?', method: 'POST' },
        { path: '/auth/check-username', method: 'POST' },
        { path: '/plan/?', method: 'GET' },
        { path: '/plan/?', method: 'PUT' },
        { path: '/plan/?', method: 'POST' },
        { path: '/security/?', method: 'ALL' },
        //{ path: '/user/get', method: 'GET' },
        { path: '/hospitality/?', method: 'GET' },
        { path: '/delivery/?', method: 'GET' },
        { path: '/focus/?', method: 'GET' },
        { path: '/delivery/?', method: 'GET' },
        { path: '/focus/?', method: 'GET' },
        { path: '/delivery/list?', method: 'GET' },
        { path: '/focus/list?', method: 'GET' },
        { path: '/title/?',method: 'GET' },
        { path: '/learningtracks/?' ,method: 'GET' },
        { path: '/supportgoals/?', method: 'GET'},
        { path: '/wearetrusted/?', method: 'GET'},
        { path: '/testimonial/?', method: 'GET'},
        { path: '/highlights/?', method: 'GET'},
        { path: '/learnkordie/list-learnwithkordie', method: 'GET' },
        { path: '/meetyourcurators/?', method: 'GET' },
        { path: '/studentsspeaksforus/?', method: 'GET' },
        { path: '/contact/?', method: 'GET' },
        { path: '/contact/?', method: 'POST' },
        { path: '/contactcontent/?', method: 'GET' },
        { path: '/category/?', method: 'GET' },
        { path: '/blog/?', method: 'GET' },
        { path: '/sana/?', method: 'GET' },
        { path: '/sana/get-all', method: 'GET' },
        { path: '/coursecategory/?', method: 'GET'},
        { path: '/crucialskillset/?', method: 'GET'},
        { path: '/faqs/?', method: 'GET'},
        { path: '/contactbanner/?', method: 'GET'},
        { path: '/goal/?', method: 'GET'},
        { path: '/topic/?', method: 'GET'},
        { path: '/time/?', method: 'GET'},
        { path: '/type/?', method: 'GET'},
        { path: '/taughtby/?', method: 'GET'},
        { path: '/blogbanner/?', method: 'GET'},
        { path: '/product/?', method: 'GET'},
        { path: '/whytakecourse/?', method: 'GET'},
        { path: '/interest/?', method: 'GET'},
        { path: '/industry/?', method: 'GET'},
        { path: '/impact/?', method: 'GET'},
        { path: '/learnwithkordie/?', method: 'GET'},
        { path: '/blogtype/?', method: 'GET'},
        { path: '/content/?', method: 'GET'},
        { path: '/about/?', method: 'GET'},
        { path: '/whykordie/?', method: 'GET'},
        { path: '/newsletter/?', method: 'ALL'},
        { path: '/subscription_plan/?', method: 'GET'},
        { path: '/course_enrollment_enquiry/?', method: 'POST'},
        { path: '/payment/webhook', method: 'POST'},
        { path: '/payment/checkout-guest', method: 'POST'},
        { path:'/payment/checkout-plan-guest/?', method: 'POST'},
        { path: '/bussiness/?', method: 'GET'},
        {path:'/scentmarketing/?', method: 'GET'},
        {path:'/hotelconcepts/?', method: 'GET'},
        {path:'/sustainability/?', method: 'GET'},
        { path:'/online-reputation-management/?', method: 'GET' },
        {path:'/recommended_courses/?', method: 'GET'},
        {path:'/online_program/?', method: 'GET'},
        {path:'/upcoming/?', method: 'GET'},
        {path:'/contact/?uploadcv/?', method: 'POST'},
        {path:'/address/?', method: 'GET'},
        { path: '/product/slug-data/?', method: 'GET' },
    ],

    skip_auth_admin: [
       { path: '/auth/admin/?', method: 'POST' },
       { path : '/auth/forget-password', method : "POST" },
       { path: '/auth/reset-password/?', method: 'POST' },

    ],
    /**
     * This one is for to skip the APIs which does not need to verify the token check.
     * 
     * Do mindfull when adding API routes to this except config, as the APIs will be exposed.
     * 
     */
    x_token_skip: [
        { path: '/security/?', method: 'ALL' }
    ],
    notification_templates: [
        {
            key: 'auth_login',
            template: '',
            text: 'Hello, your otp is {{otp}}, Please do not share it with anyone.',
        },
        {
            key: 'auth_registration',
            template: 'register-new-by-otp.html',
            text: 'Hello {{name}}, Your OTP is {{otp}}.',
        },
        {
            key: 'auth_registration_verify',
            template: 'register-new-verify.html',
            text: 'Hello {{name}}, Your verification code is {{otp}}.',
        },
        {
            key: 'subscription_plan',
            template: 'subscription-plan.html',
            text: 'Hello {{first_name}}, You have subscribe a new plan.',
        },
        {
            key: 'course_plan',
            template: 'course-plan.html',
            text: 'Hello {{first_name}}, You have subscribe a new course.',
        },
        {
            key: 'auth_forget_password_otp',
            template: '',
            text: '',
        },
        {
            key: 'auth_forget_password_link',
            subject: 'Reset Password Request',
            template: `
                Hello, <br/><br/> 
                Please click the link below to reset your password: <br/><br/> 
                <a href="{{link}}" target="_blank">Click here to reset your password</a> <br/><br/> 
                Thanks and Regards, <br/> 
                Kordie Team
            `,
            text: `
                Hello, <br/><br/> 
                Please click the link below to reset your password: <br/><br/> 
                Click here: {{link}} <br/><br/> 
                Thanks and Regards, <br/> 
                Kordie Team
            `,
        },
        {
            key: 'auth_email_verify',
            subject: 'Verify Email',
            template: 'Hello {{name}}, Your verification code for email is {{otp}}',
            text: 'Hello {{name}}, Your verification code for email is {{otp}}'
        },
        {
            key: 'auth_phone_verify',
            subject: 'Verify Phone',
            template: 'Hello {{name}}, Your verification code for phone is {{otp}}',
            text: 'Hello {{name}}, Your verification code for phone is {{otp}}'
        },
        {
            key: 'contact_us',
            subject: 'Thank you for your feedback',
            template:'contact-us.html',
            text: 'Hello {{firstname}},Thank you for your feedback'
        },
        {
            key: 'contact_admin',
            subject: 'You received a contact enquiry',
            template:'contact-admin.html',
            text: 'Hello {{firstname}},Thank you for your feedback'
        },
        {
            key: 'corporate_enquiry',
            subject: 'Thank you for your enquiry',
            template:'corporate-enquiry.html',
            text: 'Hello {{full_name}},Thank you for your feedback'
        },
        {
            key: 'corporate_admin_enquiry',
            subject: 'You received a corporate enquiry',
            template:'corporate-admin-enquiry.html',
            text: 'Hello {{full_name}},Thank you for your feedback'
        },
        {
            key: 'private_comment_by_admin',
            subject: 'Comment from Admin',
            template:'comment.template.html',
            text: ''
        },
        {
            key: 'account_creation_notification_with_password',
            subject: 'Account Generation by Admin',
            template:'account-creation-password.template.html',
            text: ''
        },
        
        // Keep adding here
    ],
    getAuthType: () => AppConfig.auth_type.split("+")[1],
    is_multilingual: false,
    //******* First one will be the default */
    languages: [],


    /**
     * This section will exclude the request from permission guard
     * Note:- If a route is mentioned in the skip auth and not mentioned here, then that route will also 
     * be removed from auth guard check.
     */
    exclude_permission: [
        { path: '/auth/logout', method: 'POST' },
        { path: '/auth/login', method: 'POST' },
        { path: '/auth/register', method: 'POST' },
        { path: '/auth/verify-otp', method: 'POST' },
        { path: '/auth/resend-otp', method: 'POST' },
        { path: '/auth/forget-password/?', method: 'POST' },
        { path: '/auth/reset-password/?', method: 'POST' },
        { path: '/auth/admin/?', method: 'POST' },
        { path: '/auth/check-username', method: 'POST' },
        { path: '/user', method: 'GET' },
        { path: '/user/get-default-client', method: 'GET' },
        { path: '/user/update_default_client', method: 'POST' },
        { path: '/security/?', method: 'ALL' },
        { path: '/user/get', method: 'GET' }
    ],

    /**
     * Add here to check againts the role permission
     * All the route should be under their parent module.
     * permissionScope: all, add, edit, view, delete
     */
    // module name: [array of path]
    api_route_module: {
        "clients": [
            { route: "/user", method: "GET", permissionScope: "view", exclude: false },
            { route: "/user", method: "POST", permissionScope: "add", exclude: false },
            { route: "/user/?", method: "GET", permissionScope: "view", exclude: false },
            { route: "/user/?", method: "PUT", permissionScope: "edit", exclude: false },
            { route: "/user/?", method: "DELETE", permissionScope: "delete", exclude: false },
            { route: "/user/country/all", method: "GET", permissionScope: "view", exclude: false },
            { route: "/state", method: "GET", permissionScope: "view", exclude: false },
            { route: "/common/upload-image", method: "POST", permissionScope: "add", exclude: false },
            { route: "/user/client_list/recent", method: "GET", permissionScope: "view", exclude: false },
        ],
        "family": [
            { route: "/user", method: "GET", permissionScope: "view", exclude: false },
           
        ],
        "reports": [],
        "settings": [
           
        ],
    },
    whitelistOrigin: [
		"http://localhost:4200",
        "http://localhost:3000",
        "https://development.kordie.com",
        "https://demoyourprojects.com:6024",
        "http://kordie-admin.demoyourprojects.com",
        "https://admin.kordie.com",
        "https://kordie.com",
        "https://jckg9v3p-3000.inc1.devtunnels.ms"
	],
};

module.exports = AppConfig;