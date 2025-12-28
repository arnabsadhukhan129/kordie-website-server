const { AuthService, CustomerService } = require("../api/v1/services");
const AppConfig = require("../config/app.config");
const { UnauthorizedError } = require("../errors/http/http.errors");
const { security } = require("../lib");
const jwt = require("jsonwebtoken");
const { Types } = require("mongoose");

module.exports = {
  verifyAuth(req, res, next) {
    const skipAuth = !!AppConfig.skip_auth.find((s) => {
      const regExp = new RegExp(s.path);
      return (
        regExp.test(req.path) &&
        (s.method === "ALL" || s.method === req.method.toUpperCase())
      );
    });
    req.skipAuth = skipAuth;
    try {
      const tokenData = req.headers[AppConfig.auth_token_key];
      if (!tokenData) throw new UnauthorizedError("authenticationError");
      const tokenArr = tokenData.split(AppConfig.auth_token_separator);
      if (tokenArr[0] !== AppConfig.auth_token_initial_text)
        throw new UnauthorizedError(`authenticationError`);
      if (!tokenArr[1]) throw new UnauthorizedError("authenticationError");
      const token = security.decrypt(tokenArr[1]);
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      console.log(req.user,"<------USER")
      next();
    } catch (e) {
      if (skipAuth) return next();
      next({ message: e.toString(), code: 401, error: true });
    }
  },

  async verifySession(req, res, next) {
    try {
      if (req.skipAuth) return next();
      const user = req.user;
      const userData = await CustomerService.getOneUser({
        _id: new Types.ObjectId(user._id),
        is_deleted: false,
      });
      if (!userData?.is_active) {
        throw new UnauthorizedError("Username is Blocked by Admin");
      }
      console.log(user, "USER");
      const sessionId = user.sessionId;
      const session = await AuthService.getSession(sessionId);
      if (!session) throw new UnauthorizedError("noAuthSession");
      const expTime = session.expiry_time;
      if (expTime.getTime() <= new Date().getTime()) {
        // update the session with logout
        await AuthService.logoutSession(sessionId, session.expiry_time);
        throw new UnauthorizedError("authSessionExpired");
      }
      const logoutTime = session.logout_time;
      if (logoutTime && logoutTime.getTime() <= new Date().getTime()) {
        // update the session with logout
        // await AuthService.logoutSession(sessionId, session.expiry_time);
        throw new UnauthorizedError("authSessionExpired");
      }
      next();
    } catch (e) {
      next(e);
    }
  },

  verifyAdminAuth(req, res, next) {
    const skipAuth = !!AppConfig.skip_auth_admin.find((s) => {
      const regExp = new RegExp(s.path);
      return (
        regExp.test(req.path) &&
        (s.method === "ALL" || s.method === req.method.toUpperCase())
      );
    });
    req.skipAuth = skipAuth;
    try {
      const tokenData = req.headers[AppConfig.auth_token_key];
      if (!tokenData) throw new UnauthorizedError("authenticationError");
      const tokenArr = tokenData.split(AppConfig.auth_token_separator);
      if (tokenArr[0] !== AppConfig.auth_token_initial_text)
        throw new UnauthorizedError(`authenticationError`);
      if (!tokenArr[1]) throw new UnauthorizedError("authenticationError");
      const token = security.decrypt(tokenArr[1]);
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (e) {
      console.log(e, ",-------ERROR");
      if (skipAuth) return next();
      next({ message: e.toString(), code: 401, error: true });
    }
  },

  async verifyAdminSession(req, res, next) {
    try {
      if (req.skipAuth) return next();
      const user = req.user;
      console.log(user, "USER");
      const sessionId = user.sessionId;
      const session = await AuthService.getSession(sessionId);
      if (!session) throw new UnauthorizedError("noAuthSession");
      const expTime = session.expiry_time;
      if (expTime.getTime() <= new Date().getTime()) {
        // update the session with logout
        await AuthService.logoutSession(sessionId, session.expiry_time);
        throw new UnauthorizedError("authSessionExpired");
      }
      const logoutTime = session.logout_time;
      if (logoutTime && logoutTime.getTime() <= new Date().getTime()) {
        // update the session with logout
        // await AuthService.logoutSession(sessionId, session.expiry_time);
        throw new UnauthorizedError("authSessionExpired");
      }
      next();
    } catch (e) {
      next(e);
    }
  },
};
