// TODO update this file with the actual email validator

module.exports = (req, res, next) => {
	const { email, name, password } = req.body;

	const validateEmail = (userEmail) => {
		return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
			userEmail
		);
	};
	if (req.path === "/signup") {
		if (![email, name, password].every(Boolean)) {
			return res.status(401).json("Missing Credentials");
		} else if (!validateEmail(email)) {
			return res.status(401).json("Invalid Email.");
		}
	} else if (req.path === "/login ") {
		if (![email, password].every(Boolean)) {
			return res.status(401).json("Missing Credentials.");
		} else if (!validateEmail(email)) {
			return res.status(401).json("Invalid Email.");
		}
	}
	next();
};
