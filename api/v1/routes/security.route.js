const Router = require('express').Router();
const { envs } = require('../../../lib');
const SecurityController = require('../controllers/security.controller');
const { SecurityMiddleware } = require('../middlewares');
if(envs.isXTokenLayerEnable()) {
    Router.get('/public-session', SecurityController.getPublicSession);
    Router.post('/check', SecurityController.checkPublicSession);
    Router.post('/x-token', SecurityMiddleware.verifySignature, SecurityController.acquireAccessToken);
}
module.exports = Router;