const jwt = require("jsonwebtoken");
const secret_key = require("../../environment.js");

module.exports = async (req, res, next) => {
	try {
		const jwtToken = req.headers.authorization;
		if (jwtToken) {
			const token = jwtToken.split(" ")[1];

			jwt.verify(token, secret_key, (error, user));
			if (error) {
				return res.sendStatus(403).json("Unauthorized");
			}
			req.user = user;
		}
		next();
	} catch (error) {
		console.error(error.message);
		return res.sendStatus(401).json("Unauthorized access!");
	}
};
