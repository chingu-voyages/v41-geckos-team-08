const jwt = require("jsonwebtoken");
const secret_key = require("../../environment");
const userId = require("uuid");

const uuid = userId.v4();

const jwtGenerator = () => {
	const payload = {
		user: uuid,
	};
	return jwt.sign(payload, secret_key, {
		algorithm: "HS256",
		expiresIn: "1hr",
	});
};
console.log(secret_key);

module.exports = jwtGenerator;
