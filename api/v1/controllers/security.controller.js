const { SignatureHeaderKey } = require('../../../config/enum.config');
const { DateLib, StringLib, envs, security } = require('../../../lib');
const { RedisService, SecurityService } = require('../services');
const crypto = require('crypto');

const SecurityController = {
    async getPublicSession(req, res, next) {
        try {
            const date = new Date();
            const key = crypto.randomBytes(8).toString('hex').toUpperCase();
            const sessionId = `MMSID${DateLib.formatDate(date, 'ymdhis')}`;
            // save the API key to redis
            await RedisService.addPublicSessionApiKey(sessionId, key);
            console.log(sessionId, key, 'PUBLIC SESSION');
            next({
                apiKey: key,
                sessionId
            });
        } catch(e) {
            next(e);
        }
    },
    async checkPublicSession(req, res, next) {
        try {
            const sessionId = req.body.sessionId;
            const data = await RedisService.getAllPublicSessionApiKey(sessionId);
            next({key: data});
        } catch(e) {
            next(e);
        }
    },

    async acquireAccessToken(req, res, next) {
        try {
            const signature = req.signature;
            // create the access token with this signature
            const userAgent = req.headers['user-agent'];
            const date = new Date();
            const device = req.body.device || 'W';

            const uniqueIdentifier = StringLib.generateRandomStrings(9);

            const option = {
                expiresIn: envs.getXTokenTime()
            };
            const payload = {
                userAgent,
                date: date.toISOString(),
                device,
                uid: uniqueIdentifier,
                signature: signature
            };
            const token = security.getAPIAccessToken(payload, option);

            // store this for to prevent future use
            await SecurityService.addSignatureToken({
                session_id: req.headers[SignatureHeaderKey.SESSION_ID],
                expiry_time: DateLib.modifyAKADate(date, `+${envs.getXTokenTime()}`),
                creation_time: date,
                signature: signature,
                token: token,
                token_payload: payload
            });

            next({
                accessToken: token
            });

            
        } catch(e) {
            next(e);
        }
    }
};

module.exports = SecurityController;