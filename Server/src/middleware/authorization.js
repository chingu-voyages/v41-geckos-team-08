<<<<<<< HEAD
const jwt = require('jsonwebtoken');
const { secret_key } = require('../../environment.js');
=======
const jwt = require("jsonwebtoken");
const { secret_key } = require("../../environment.js");
>>>>>>> 5abac27c0f89231a2806aea1c0205da9730f714f

module.exports = async (req, res, next) => {
	const jwtToken = req.headers.authorization;

	if (!jwtToken) return res.status(403).json('Unauthorized');

	next();
	return;
	try {
<<<<<<< HEAD
		if (jwtToken) {
			const token = jwtToken.split(' ')[1];

			jwt.verify(token, secret_key, (error, user));
			if (error) {
				return res.status(403).json('Unauthorized');
=======
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
>>>>>>> 5abac27c0f89231a2806aea1c0205da9730f714f
			}
		}
		next();
	} catch (error) {
		console.error(error.message);
<<<<<<< HEAD
		return res.status(403).json('Unauthorized access!');
=======
		return res.status(403).json("Unauthorized access!");
>>>>>>> 5abac27c0f89231a2806aea1c0205da9730f714f
	}
};
