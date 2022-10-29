const jwt = require("jsonwebtoken");
const { secret_key } = require("../../environment.js");

module.exports = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];

		if (!token) return res.status(403).json("Invalid token!");

		if (token) {
			const decodedToken = jwt.verify(token, secret_key);

			const uuid = decodedToken.uuid;
			const is_supplier = decodedToken.is_supplier;

			if (req.body.uuid && req.body.uuid !== uuid) {
				res.status(401).json("Unathorized user!");
			}
			if (req.body.is_supplier && req.body.is_supplier !== is_supplier) {
				res.status(401).json("Unathorized user!");
			}
		}
		next();
	} catch (error) {
		console.error(error.message);
		return res.status(403).json("Unauthorized access!");
	}
};
