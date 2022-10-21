const jwt = require("jsonwebtoken");

const userId = require("uuid");

const generatedUUID = userId.v4();

const secret_key = require("../../environment.js");

const jwtGenerator = (user_id) => {
	const uuid = generatedUUID;
	const payload = {
		user: uuid,
	};
	return jwt.sign(payload, secret_key, { expiresIn: "1hr" });
};

module.exports = jwtGenerator;
