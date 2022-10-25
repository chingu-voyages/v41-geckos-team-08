const validateEmail = (req, res, next) => {
	const { email } = req.body;

	if (email ? !validEmail(email) : null) {
		return res.status(401).json("You have entered an invalid email address!");
	}
	next();
};

const validEmail = (email) => {
	const mailformat =
		/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

	return mailformat.test(email);
};

module.exports = validateEmail;
