const AppConfig = require("./app.config");
const whitelistOrigin = AppConfig.whitelistOrigin;

const corsOptions = {
	origin: (origin, callBack) => {
		console.log("origin", origin);
		if (whitelistOrigin.indexOf(origin) !== -1 || !origin) {
			callBack(null, true);
		} else {
			callBack(new Error("Not allowed by CORS"));
		}
	},
	optionsSuccessStatus: 200,
};

module.exports = corsOptions;
