const {SignatureHeaderKey} = require("../../../../config/enum.config");
const { ForbiddenError } = require("../../../../errors/http/http.errors");
const { CommonLib:{extractSignatureHeader}, envs, DateLib } = require("../../../../lib/");
const { SecurityService, RedisService } = require("../../services");

const SecurityMiddleware = {

    async verifySignature(req, res, next) {
        try {
            const headers = req.headers;
            const signature = headers[SignatureHeaderKey.SIGNATURE];
            if(!signature) {
                throw new ForbiddenError('noSignature');
            }
            // remove the signature from headers
            delete headers[SignatureHeaderKey.SIGNATURE];

            // Check for session
            if(envs.isUniqueSignatureSession()) {
                const apiKeyData = await RedisService.getAllPublicSessionApiKey(headers[SignatureHeaderKey.SESSION_ID]);
                if(!apiKeyData) throw new ForbiddenError('signatureSessionExpired');
            } else {
                // not unique check the expiry time
                const apiKeyData = await RedisService.getAllPublicSessionApiKey(headers[SignatureHeaderKey.SESSION_ID]);
                if(!apiKeyData) throw new ForbiddenError('signatureSessionExpired');
                const jsonApiKey = JSON.parse(apiKeyData);
                if(!jsonApiKey.date) throw new ForbiddenError('signatureSessionInvalid');
                const createdAt = new Date(jsonApiKey.date);
                const expiryTime = DateLib.modifyAKADate(createdAt, `+${envs.signatureSessionExpiryLimit()}`);
                const nowdate = new Date();
                if(expiryTime.getTime() <= nowdate.getTime()) {
                    // as expired. so remove from redis
                    await RedisService.removeSessionAPIKey(headers[SignatureHeaderKey.SESSION_ID]);
                    throw new ForbiddenError('signatureSessionExpired');
                }
            }

            // check if the date the signature generated is valid till now
            const signatureGeneratedDate = new Date(headers[SignatureHeaderKey.DATE]);
            const signatureGenerateExpiryDate = DateLib.modifyAKADate(signatureGeneratedDate, `+${envs.signatureDateTimeLimit()}`);

            const currDate = new Date();
            // if the expiry date has been passed
            if(signatureGenerateExpiryDate.getTime() <= currDate.getTime() 
            // or the signature is created using a future date
            || (signatureGeneratedDate.getTime() > currDate.getTime())) {
                throw new ForbiddenError('signatureExpired');
            }
            

            // get the signature
            const __signature = await SecurityService.getSignature(extractSignatureHeader(headers));
            console.log(signature, "User Provided");
            console.log(__signature, 'System generated');
            if(envs.isUniqueSignatureSession()) {
                // remove the session
                await RedisService.removeSessionAPIKey(headers[SignatureHeaderKey.SESSION_ID]);
            } else {
                // remove only if the expiry time reached
                const apiKeyData = await RedisService.getAllPublicSessionApiKey(headers[SignatureHeaderKey.SESSION_ID]);
                const jsonApiKey = JSON.parse(apiKeyData);
                const createdAt = new Date(jsonApiKey.date);
                const expiryTime = DateLib.modifyAKADate(createdAt, `+${envs.signatureSessionExpiryLimit()}`);
                const nowdate = new Date();
                if(expiryTime.getTime() <= nowdate.getTime()) {
                    // remove here
                    await RedisService.removeSessionAPIKey(headers[SignatureHeaderKey.SESSION_ID]);
                }
            }
            if(signature !== __signature) {
                throw new ForbiddenError('signatureMissmatch');
            }
            // matched signature
            req.signature = signature;

            // cehck if the signature is already being used or not
            const isOldSignatureExist = await SecurityService.getSignatureTokenBySignature(signature);
            if(isOldSignatureExist) {
                throw new ForbiddenError('signatureInvalid');
            }

            next();
        }catch(e) {
            next(e);
        }
    }

};

module.exports = SecurityMiddleware;