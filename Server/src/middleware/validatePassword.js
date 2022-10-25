const validatePassword = (req, res, next) => {
	const { password } = req.body;

	const regPassword =
		/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{7,15}$/;

	if (!password.match(regPassword)) {
		return res
			.status(403)
			.json(
				"Password must contain atleast one uppercase letter, number and symbol."
			);
	}
	next();
};

module.exports = validatePassword;
