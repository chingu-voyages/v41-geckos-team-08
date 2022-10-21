module.exports = (req, res, next) => {
	const { email, name, password, is_supplier, is_active, phone } = req.body;

	const validEmail = (email) => {
		return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
			email
		);
	};
	if (req.path === "/signup") {
		if (
			![email, name, password, is_supplier, is_active, phone].every(Boolean)
		) {
			return res.status(401).json("Missing Credentials");
		} else if (!validEmail(email)) {
			return res.status(401).json("Invalid Email.");
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
