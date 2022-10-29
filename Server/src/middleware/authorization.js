const jwt = require("jsonwebtoken");
const secret_key = require("../../environment.js");

module.exports = async (req, res, next) => {
	try {
		const jwtToken = req.header("token");
		if (!jwtToken) {
			return res.status(403).send("You are not authorized!");
		}
		const payload = jwt.verify(jwtToken, secret_key);
		payload.user = { is_supplier, uuid };
		req.user = payload.user;

		next();
	} catch (error) {
		console.error(error.message);
		return res.status(403).send("Unauthorized access!");
	}
};
