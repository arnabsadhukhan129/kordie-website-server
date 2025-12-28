const AppConfig = require('../../../../config/app.config');
const { UnprocessableEntityError, ForbiddenError } = require('../../../../errors/http/http.errors');
const {security, StringLib, DateLib} = require('../../../../lib');
const ResetPasswordMiddleware = {
    enabledPasswordFlow(req, res, next) {
        try {
            if(AppConfig.auth_type.split('+')[1] !== 'password') throw new ForbiddenError('Not allowed');
            next();
        } catch(e) {
            next(e);
        }
    },
    async checkToken(req, res, next) {
        try {
            const token = req.headers['x-reset-token'];
            if(!token) throw new UnprocessableEntityError('resetPassTokenRequired');
            const decoded = security.decrypt(token);
            if(!decoded) throw new ForbiddenError('resetPassTokenInvalid');
            if(!StringLib.isJsonParsable(decoded)) throw new ForbiddenError('resetPassTokenMalformed');
            const data = JSON.parse(decoded);
            // check the time stanmp
            const createdAt = new Date(data.timestamp);
            if(!createdAt.getTime) throw new UnprocessableEntityError('resetPassPayloadMalformed');
            const date = new Date();
            const expiryDate = DateLib.modifyAKADate(createdAt, `+${process.env.AUTH_FORGET_PASSWORD_TIME_GAP || '5min'}`);
            if(expiryDate.getTime() < date.getTime()) throw new ForbiddenError('resetPassSessionExpierd');
            req.body.user_id = data._id;
            next();
        } catch(e) {
            next(e);
        }
    },
    checkPassword(req, res, next) {
        try {
            const password = req.body.new_password;
            const confirmPassword = req.body.confirm_password;
            if(!password) throw new UnprocessableEntityError('Password not provided.');
            if(!confirmPassword) throw new UnprocessableEntityError('resetPassConfirmPasswordRequired');
            if(password !== confirmPassword) {
                throw new UnprocessableEntityError('resetPassPasswordConfirmMissMatch');
            }
            next();
        } catch(e) {
            next(e);
        }
    }
};

module.exports = ResetPasswordMiddleware;