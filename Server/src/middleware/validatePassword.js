const validatePassword = (req, res, next) => {
	const { password } = req.body;

	const regExpWeak = /[a-z]/;
	const regExpMedium = /\d+/;

	const regPassword =
		/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

	if (password.match(regExpWeak) && password.length < 6) {
		return res
			.status(401)
			.json(
				"Password must be more that 6 characters long with atleast one uppercase letter."
			);
	}
	if (password.match(regExpMedium && password.length >= 6)) {
		return res
			.status(401)
			.json("Password must contain atleast one uppercase letter.");
	}
	if (password.match(regPassword && password.length >= 6)) {
		res.status(200);
	}
	next();
};

module.exports = validatePassword;
