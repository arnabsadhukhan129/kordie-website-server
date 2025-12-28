const AppConfig = require("../config/app.config");

module.exports = {
    /**
     * Returns true if the environment is running in production.
     * 
     * Key:- NODE_ENV
     * @returns {boolean}
     */
    isProd(){
        return process.env.NODE_ENV === 'production';
    },
    /**
     * Returns true if the environment is running in development.
     * 
     * Key:- NODE_ENV
     * @returns {boolean}
     */
    isDev(){
        return process.env.NODE_ENV === 'development';
    },
    /**
     * Returns true if the environment is running in staging.
     * 
     * Key:- NODE_ENV
     * @returns {boolean}
     */
    isStaging(){
        return process.env.NODE_ENV === 'staging';
    },
    /**
     * Returns true if the stack trace is enabled.
     * 
     * Key:- PRINT_STACK_TRACE
     * @returns {boolean}
     */
    isStackTraceEnabled(){
        return process.env.PRINT_STACK_TRACE === 'true';
    },
    /**
     * Returns true if the encrypt is enabled.
     * 
     * Key:- USE_ENCRYPTED_PIPE
     * @returns {boolean}
     */
    useEncryptedPipe(){
        return process.env.USE_ENCRYPTED_PIPE === 'true';
    },
    /**
     * Returns the frontend url of the server App
     * 
     * Key:- APP_FRONTEND_URL
     * 
     * Returns from env if not found then find in app_frontend_url in the app config.
     * @returns {string} the frontend url of the APP
     */
    getFrontEndUrl() {
        return process.env.APP_FRONTEND_URL || AppConfig.app_frontend_url;
    },
    /**
     * Should use redis on secure pipe
     * @returns {boolean}
     */
    isSecureRedis() {
        return process.env.REDIS_PASSWORD_PROTECTED === 'true';
    },
    /**
     * Is the redis service is enable or not and if enable then the server will try to connect redis.
     * @returns {boolean}
     */
    isRedisEnable() {
        return process.env.REDIS_ENABLE === 'true';
    },
    /**
     * Configure redis for redis search.
     * 
     * Note:- This will require the redisjson to be avaiable in the native machine.
     * @returns {boolean}
     */
    useRedisSearch() {
        return process.env.USE_SEARCH_INDEX === 'true';
    },
    getAWSUrl() {
        return process.env.AWS_URL;
    },
    getAWSAccessKeyId() {
        return process.env.AWS_ACCESS_KEY_ID;
    },
    getAWSSecretAccessKey() {
        return process.env.AWS_SECRET_ACCESS_KEY;
    },
    getAWSRegion() {
        return process.env.AWS_REGION;
    },
    getAWSBucket() {
        return process.env.AWS_BUCKET;
    },
    getAWSACL() {
        return process.env.AWS_ACL;
    },
    isMailSecure(){
        return process.env.MAIL_SECURE === 'true';
    },
    encryptAppResponse() {
        return process.env.ENCRYPT_APP_RESPONSE === 'true';
    },
    isXTokenLayerEnable() {
        return process.env.ENABLE_X_TOKEN_LAYER === 'true';
    },
    getXTokenTime() {
        return process.env.X_TOKEN_EXP_TIME || '1h';
    },
    getTokenSecureKey() {
        return process.env.TOKEN_SECURE_KEY;
    },
    isUniqueSignatureSession() {
        return process.env.UNIQUE_SIGNATURE_SESSION === 'true';
    },
    signatureSessionExpiryLimit() {
        return process.env.SESSION_EXPIRY_TIME || '1h';
    },
    signatureDateTimeLimit() {
        return process.env.SINATURE_TOKEN_EXPIRY_LIMIT || '1min';
    },
    isOTPTestMode() {
        return process.env.OTP_TEST_MODE === 'true';
    },
    isSMSModeEnable() {
        return process.env.SMS_MODE === 'true';
    }
};