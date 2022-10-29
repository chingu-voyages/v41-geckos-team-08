const jwt = require('jsonwebtoken');
const { secret_key } = require('../../environment');

<<<<<<< HEAD
function jwtGenerator(uuid, is_supplier) {
	const payload = {
		user: uuid,
		is_supplier,
=======
const jwtGenerator = (uuid, is_supplier) => {
	const payload = {
		user: {
			uuid,
			is_supplier,
		},
>>>>>>> 5abac27c0f89231a2806aea1c0205da9730f714f
	};
	return jwt.sign(payload, secret_key, {
		algorithm: 'HS256',
		expiresIn: '1hr',
	});
};

module.exports = jwtGenerator;
