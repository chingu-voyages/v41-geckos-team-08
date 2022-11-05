const validateUUID = (req, res, next) => {
	const uuid = req.params.uuid;

	if (!isValidUUID(uuid))
		return res.status(400).json({ detail: 'Invalid UUID' });

	next();
};

const isValidUUID = (uuid) => {
	const regexExp =
		/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

	return regexExp.test(uuid);
};

module.exports = validateUUID;
module.exports.isValidUUID = isValidUUID;
