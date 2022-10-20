module.exports = (req, res, next) => {
	const { email, password, name } = req.body;

	function validEmail(userEmail) {
		return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
			userEmail
		);
	}
	if (req.path === "/register") {
		if (![email, name, password].every(Boolean)) {
			return res.status(401).json("Missing Credentials");
		} else if (!validEmail(email)) {
			return res.status(401).json("INvalid Email.");
		}
	} else if (req.path === "/login ") {
		if (![email, password].every(Boolean)) {
			return res.status(401).json("Missing Credentials.");
		} else if (!validEmail(email)) {
			return res.status(401).json("Invalid Email.");
		}
	}
	next();
};
