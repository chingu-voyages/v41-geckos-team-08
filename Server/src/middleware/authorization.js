const jwt = require('jsonwebtoken');
const { secret_key } = require('../../environment.js');

module.exports = async (req, res, next) => {
	const jwtToken = req.headers.authorization;

	if (!jwtToken) return res.status(403).json('Unauthorized');

	next();
	return;
	try {
		if (jwtToken) {
			const token = jwtToken.split(' ')[1];

			jwt.verify(token, secret_key, (error, user));
			if (error) {
				return res.status(403).json('Unauthorized');
			}
			req.user = user;
		}
		next();
	} catch (error) {
		console.error(error.message);
		return res.status(403).json('Unauthorized access!');
	}
};
