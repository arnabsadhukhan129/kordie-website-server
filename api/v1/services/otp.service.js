const fs = require('fs');
const path = require('path');
const {StringLib, NumberLib, DateLib, security, envs} = require('../../../lib');
const AppConfig = require('../../../config/app.config');
const NotificationService = require('./notification.service');
const AuthService = require('./auth.service');
const UserService = require('./user.service');
const {Otp} = require('../db/models');
const enumConfig = require('../../../config/enum.config');

const OtpService = {
    async sendOtp(emailOrPhone, reason, optionalReplacer = {}) {
        const otp = envs.isOTPTestMode() ? AppConfig.test_otp : this.generateOtp();
        const templateFormat = AppConfig.notification_templates.find(n => n.key === reason);
        if(!templateFormat) throw new Error("No Template found");
        if(StringLib.isEmail(emailOrPhone)) {
            // send otp to email
            /**
             * 1. Select the template
             * 2. Replace the otp
             * 3. send through email
             */
            const template = templateFormat.template || 'generic.template.html';
             // check if the template is a file name or just a string
             const p = path.extname(template);
             let templateData = templateFormat.template;
             if(p === '.html') {
                const pathOfTemplate = AppConfig.template_path ? path.resolve(AppConfig.base_path + '/' + AppConfig.template_path) : `${__dirname}/../../../templates`;
                const fullPath = `${pathOfTemplate}/${template}`;
                templateData = fs.readFileSync(fullPath, {encoding: 'utf-8'});
             }
            // replace the data
            if(!optionalReplacer) optionalReplacer = {};
            optionalReplacer.otp = otp;
            for(const [key, value] of Object.entries(optionalReplacer)) {
                const regEx = new RegExp(`{{${key}}}`, 'gi');
                if(regEx.test(templateData) && value) {
                    templateData = templateData.replace(regEx, value);
                }
            }
            let subject = '';
            switch(reason) {
                case 'auth_registration':
                    subject = 'OTP for registration';
                break;
                case 'auth_login':
                    subject = 'OTP for Login';
                break;
            }
            // now send the email
            NotificationService.sendEmail({body:templateData, text: templateData,  to:emailOrPhone, subject: subject || 'New OTP'}).then(() => {}).catch(err => {console.log(err);});
        } else if(StringLib.isPhone(emailOrPhone)) {
            // send to the phone
            /**
             * 1. Select the message template
             * 2. Replace the otp
             * 3. Send through SMS
             */
            // let message = MessageConfig[templateFormat.key];
            let message = templateFormat.text;
            if(!message) throw new Error("Message feed is invalid");
            if(!optionalReplacer) optionalReplacer = {};
            optionalReplacer.otp = otp;
            for(const [key, value] of Object.entries(optionalReplacer)) {
                const regEx = new RegExp(`{{${key}}}`, 'gi');
                if(regEx.test(message) && value) {
                    message = message.replace(regEx, value);
                }
            }
            NotificationService.sendSMS(message, emailOrPhone);
        }
        return otp;        
    },
    async generateAndSendOtp(emailOrPhone, userId, reason, optionalObjectReplacer = {}) {
        const otp = await this.sendOtp(emailOrPhone, reason, optionalObjectReplacer);
        const otpres = await this.createOtp(otp, userId, reason);
        return otpres;
    },
    generateOtp() {
        return AppConfig.otp_alpha_numeric ?
        StringLib.generateRandomStrings(AppConfig.otp_length).toUpperCase() :
        NumberLib.generateRandomNumber(AppConfig.otp_length);
    },
    async createOtp(otp, userId, reason, expTime=process.env.OTP_TOKEN_EXP_TIME) {
        const otpData = {
            otp: otp,
            // otp_phone: otp_phone || null,
            token_id: security.generateToken(),
            user_id: userId,
            reason: reason,
            exp_time: DateLib.modifyAKADate(new Date(), expTime ? `+${expTime}` : '+5min')
        };
        return await Otp.create(otpData);
    },
    async getOtpByTokenId(tokenId) {
        return await Otp.findOne({token_id: tokenId});
    },
    async getResponseBasedOnOtpTrigger(otpRes) {
        if(!otpRes.reason) return null;
        switch(otpRes.reason) {
            case 'auth_login':
                user_id = otpRes.user_id.toString();
                await UserService.updateUser(user_id,{is_validated: true});
                // create a session based on the user id
                return await AuthService.createSessionFromUserId(otpRes.user_id);
            case 'auth_registration':
                //console.log("aaaaaa");
                
                if(AppConfig.login_after_registration) {
                    const session = await AuthService.createSessionFromUserId(otpRes.user_id);
                    return {login_flow: true, ...session, flow: otpRes.reason};
                } else {
                    return {login_flow: false};
                }
            case 'auth_registration_verify':
                //console.log("bbbbbbb");
                user_id = otpRes.user_id.toString();
                await UserService.updateUser(user_id,{is_validated: true});
                if(AppConfig.login_after_registration) {
                    const session = await AuthService.createSessionFromUserId(otpRes.user_id);
                    return {login_flow: true, ...session, flow: otpRes.reason};
                } else {
                    return {login_flow: false, message:"OTP verified successfully.", flow: otpRes.reason};
                }
            case 'auth_forget_password_otp':
                /**
                 * 1. Get the user id 
                 * 2. Create a change password session token with the user id
                 * 3. return 
                 */
                if(!otpRes.user_id) return null;
                return {token: security.encrypt(JSON.stringify({id: otpRes.user_id, timestamp: Date.now()})), flow: otpRes.reason};
            // TODO add more cases here
        }
    },
    async invalidateOtp(id) {
        return await Otp.updateOne({_id: id}, {$set: {otp_invalidate: enumConfig.OTP_INVALIDATE.INVALID}});
    },
    async validToken(id) {
        console.log("Valid Token executed",id)
        const response =  await Otp.findOne({user_id: id, otp_invalidate: 0}).lean()
        
        console.log(response)
        return response;
    }
};

module.exports = OtpService;