const validatePassword = (req, res, next) => {
	const { password } = req.body;

	if (!password) {
		next();
		return;
	}

	const regPassword =
		/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;

	if (password && password.length < 6) {
		return res
			.status(401)
			.json('Password must be at least 8 characters long.');
	}
	if (!password.match(regPassword)) {
		return res
			.status(401)
			.json(
				'Password must contain at least one uppercase letter, number and symbol.'
			);
	}

	next();
};

module.exports = validatePassword;
