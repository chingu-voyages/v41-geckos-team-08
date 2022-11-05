const jwt = require("jsonwebtoken");
const { secret_key } = require("../../environment");

const jwtGenerator = (uuid, is_supplier, email) => {
	const payload = {
		user: {
			uuid,
			is_supplier,
			email,
		},
	};
	return jwt.sign(payload, secret_key, {
		algorithm: "HS256",
		expiresIn: "1hr",
	});
};

module.exports = jwtGenerator;
