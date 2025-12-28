const { ForbiddenError } = require("../errors/http/http.errors");

const jwt = require('jsonwebtoken');
const { security, envs } = require("../lib");
const AppConfig = require("../config/app.config");
const { SignatureHeaderKey } = require("../config/enum.config");

module.exports = {
    
    verifyAPIRequest(req, res, next){
        try {
            if(!envs.isXTokenLayerEnable()) {
                return next();
            }
            const excludedPath = !!AppConfig.x_token_skip.find(s => {
                const reg = new RegExp(s.path);
                return reg.test(req.path) && (s.method === 'ALL' || s.method === req.method.toUpperCase());
            });
            if(excludedPath) {
                return next();
            }
            const token = req.headers[SignatureHeaderKey.X_TOKEN];
            if(!token) {
                throw new ForbiddenError('notAllowedXToken');
            }
    
            // fetch the token
            const decoded = jwt.verify(token, process.env.TOKEN_SECURE_KEY);
            if(!decoded) {
                throw new ForbiddenError('tokenInvalid');
            }
            const tokenUserAgent = decoded.userAgent;
            const requestUserAgent = req.headers['user-agent'];
            if(security.encrypt(tokenUserAgent) !== security.encrypt(requestUserAgent)) {
                throw new ForbiddenError('deviceNotRecognised');
            }
            next();
        } catch(e) {
            if(e instanceof jwt.TokenExpiredError) {
                next(new ForbiddenError('tokenExpired'));
                return;
            }
            next(e);
        }

    }
};