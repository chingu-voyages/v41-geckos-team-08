const jwt = require("jsonwebtoken");
const { secret_key } = require("../../environment");

function jwtGenerator(uuid) {
	const payload = {
		user: uuid,
	};
	return jwt.sign(payload, secret_key, {
		algorithm: "HS256",
		expiresIn: "1hr",
	});
}

module.exports = jwtGenerator;
