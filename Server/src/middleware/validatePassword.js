const validatePassword = (req, res, next) => {
	const { password } = req.body;

	const regPassword =
		/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

	if (password && password.length < 6) {
		return res.status(401).json("Password must be atleast 6 characters long.");
	}
	if (!password.match(regPassword)) {
		return res
			.status(401)
			.json(
				"Password must contain atleast one uppercase letter, number and symbol."
			);
	}
	if (password.match(regPassword)) {
		res.status(200);
	}
	next();
};

module.exports = validatePassword;