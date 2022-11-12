const route = require('express').Router();
const client = require('../config/db.js');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../middleware/jwtGenenrator.js');
const validateEmail = require('../middleware/validateEmail.js');
const validatePassword = require('../middleware/validatePassword.js');

route.post('/', validatePassword, validateEmail, async (req, res) => {
	try {
		//1 destructure the req.body
		const { email, password } = req.body;
		//2 check the user doesn't exist(if true throw error)

		if (!(email && password)) {
			res.status(400).send('All fields are required.');
		}
		const user = await client.query(
			'SELECT users.uuid, users.email, users.password, users.is_supplier, users.name, users.phone, trades.uuid as trades_uuid, trades.description from users left join supplier_trade on users.uuid = supplier_trade.supplier_uuid left join trades on supplier_trade.trades_uuid = trades.uuid WHERE email = $1',
			[email]
		);

		if (!user.rowCount) {
			return res.status(401).json('User does not exist.');
		}
		//3 check if password matches stored password(if false throw error)
		const validPassword = await bcrypt.compare(
			password,
			user.rows[0].password
		);

		if (!validPassword) {
			return res.status(401).json('Password is incorrect.');
		}
		//4 give access
		const token = jwtGenerator(
			user.rows[0].uuid,
			user.rows[0].is_supplier,
			user.rows[0].email
		);
		res.status(200).json({
			token,
			user: {
				uuid: user.rows[0].uuid,
				email: user.rows[0].email,
				name: user.rows[0].name,
				is_supplier: user.rows[0].is_supplier,
				phone: user.rows[0].phone,
				trade: {
					description: user.rows[0].description,
					uuid: user.rows[0].trades_uuid
				}
			},
			check: user
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json('Server error.');
	}
});

module.exports = route;
