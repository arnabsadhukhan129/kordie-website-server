const { ForbiddenError, UnprocessableEntityError } = require('../../../../errors/http/http.errors');
const { security } = require('../../../../lib');
const {UserService} = require('../../services');
const ChangePasswordMiddleware = {
    async validateChangePassword(req, res, next) {
        try {
            const {old_password, new_password, confirm_passwprd} = req.body;
            // Check if the old password is matched
            const user = await UserService.getUserForChangePass(req.user._id);
            if(!user) throw new ForbiddenError('invalidUser');
            if(user.password !== security.hashPassword(old_password)) {
                throw new UnprocessableEntityError('oldPasswordMissmatch');
            }
            // check for the password and confirm password
            if(new_password !== confirm_passwprd) {
                throw new UnprocessableEntityError('passConfirmPassMissmatch');
            }
            next();
        } catch(e) {
            next(e);
        }
    },
};

module.exports = ChangePasswordMiddleware;
