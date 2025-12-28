const RedisClient = require('../../../connectors/redis.connector');
const RedisService = {
    async addPublicSession(sessionId, signedObject) {
        try {
            return await RedisClient.json.set(`PSS:${sessionId}`, '$', signedObject);
        } catch(e) {
            console.log(e);
            return null;
        }
    },
    async addPublicSessionApiKey(sessionId, apiKey) {
        try {
            const data = {
                apiKey,
                date: new Date().toISOString()
            };
            return await RedisClient.json.set(`API-SS:${sessionId}`, '$', JSON.stringify(data));
        } catch(e) {
            console.log(e);
            return null;
        }
    },
    async getAllPublicSessionApiKey(sessionId) {
        return await RedisClient.json.get(`API-SS:${sessionId}`);
    },
    async removeSessionAPIKey(sessionId) {
        await RedisClient.json.del(`API-SS:${sessionId}`);
    },
    async getAllPublicSession(sessionId) {
        return await RedisClient.json.get(`PSS:${sessionId}`);
    },
    async clearAllPublicSession(sessionId) {
        await RedisClient.json.del(`PSS:${sessionId}`);
    },
    async searchSignature(signature){
        // console.log(signature, "SIGNATURE");
        const searchresult = await RedisClient.ft.search('idx:pss', `@signature:(${signature})`);
        return searchresult;
    },
    async addRoleOfUser(permission, userId) {
        return await RedisClient.set("__user-permission:" + userId, JSON.stringify(permission));
    },
    async getUserPermission(userId) {
        const permission = await RedisClient.get("__user-permission:" + userId);
        if(!permission) return false;
        return JSON.parse(permission);
    }
};

module.exports = RedisService;