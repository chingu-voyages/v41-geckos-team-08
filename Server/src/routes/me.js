const route = require('express').Router();
const client = require('../config/db');
const authorization = require('../middleware/authorization.js');
const { formatOneUserResponse } = require('../components/format');

route.get('/', authorization, async (req, res) => {
	const { user } = req.user;

	const sql =
		'select uuid, email, is_supplier, name, phone from users where uuid = $1';
	const userResponse = await await client.query(sql, [user]);

	if (userResponse.rowCount === 0) {
		res.status(404).json({
			detail: `User with uuid: ${user} does not exist`,
		});
		return;
	}

	const responseData = await formatOneUserResponse(userResponse.rows[0]);

	res.status(200).json({
		data: responseData,
	});
});

module.exports = route;
