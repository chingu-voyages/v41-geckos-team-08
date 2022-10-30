const jwt = require("jsonwebtoken");
const { secret_key } = require("../../environment.js");

module.exports = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];

		if (!token) return res.status(403).json("Invalid token!");

		const decodedToken = jwt.verify(token, secret_key);

		const { uuid, is_supplier } = decodedToken.user;

		const user = {
			user: uuid,
			is_supplier,
		};

		next();
	} catch (error) {
		console.error(error.message);
		return res.status(403).json("Unauthorized access!");
	}
};
