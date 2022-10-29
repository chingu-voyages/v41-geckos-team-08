const jwt = require('jsonwebtoken');
const { secret_key } = require('../../environment');

function jwtGenerator(uuid, is_supplier) {
	const payload = {
		user: uuid,
		is_supplier,
	};
	return jwt.sign(payload, secret_key, {
		algorithm: 'HS256',
		expiresIn: '1hr',
	});
}

module.exports = jwtGenerator;
