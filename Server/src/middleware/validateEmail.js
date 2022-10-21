const validateEmail = (req, res, next) => {
	if (req.body.email) {
		const regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

		if (!regEx.test(req.body.email))
			return res.status(400).json({ detail: 'Invalid email' });
	}

	next();
};

module.exports = validateEmail;
