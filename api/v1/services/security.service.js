const crypto = require('crypto');
const { SignatureToken } = require("../db/models");
const RedisService = require("./redis.service");
const { SignatureHeaderKey } = require('../../../config/enum.config');

const SecurityService = {
    async getSignature(headers) {
        const start = Date.now();
        // 1: Acquire the Public API key from session id
        console.log(headers);
        const API_KEY = JSON.parse(await RedisService.getAllPublicSessionApiKey(headers[SignatureHeaderKey.SESSION_ID]));
        console.log(API_KEY, 'API KEY');
        // 2: Sort the header by key
        const sortedKeys = Object.keys(headers).sort((a, b) => {
            if(a < b) return -1;
            if(a > b) return 1;
            return 0;
        });
        // 3: Create the signed string from the header
        const sortedHeaderStringtoBeSign = sortedKeys.map(s => `${s}=${headers[s]}`).join(';');
        console.log(sortedHeaderStringtoBeSign, 'Signed string');
        // 4: Create the hash with the API key from the signed string
        const signedHash = crypto.createHmac('sha256', API_KEY.apiKey).update(sortedHeaderStringtoBeSign).digest('hex');
        console.log("Signed Hash:", signedHash);
        // 5: Created the signature from the signed hash using the csrf key
        const __signature = crypto.createHmac('sha256', headers['x-mm-csrf-key']).update(signedHash).digest('hex');
        console.log(Date.now() - start, "Get signature time take");
        return __signature;
    },

    async addSignatureToken(signatureTokenPayload) {
        const signature = new SignatureToken(signatureTokenPayload);
        return await signature.save();
    },
    async getSignatureTokenBySignature(signature) {
        const signatureToken = await SignatureToken.findOne({
            signature: signature
        });
        return signatureToken;
    }
};

module.exports = SecurityService;