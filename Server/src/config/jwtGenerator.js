const jwt = require("jsonwebtoken");
require("dotenv").config();
const userId = require("uuid");

const generatedUUID = userId.v4();

//const secret_key = require("../../environment.js");

const jwtGenerator = () => {
	const uuid = generatedUUID;
	const payload = {
		user: uuid,
	};
	return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1hr" });
};

module.exports = jwtGenerator;
