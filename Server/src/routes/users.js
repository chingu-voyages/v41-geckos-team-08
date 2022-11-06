const route = require('express').Router();
const client = require('../config/db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const { formatOneUserResponse } = require('../components/format');
const { saveCities } = require('../components/saveCities');
const { saveTrades } = require('../components/saveTrades');
const validateUUID = require('../middleware/validateUUID');
const validateEmail = require('../middleware/validateEmail'); // TODO update this with the actual validate Email middleware
const validatePassword = require('../middleware/validatePassword');

// TODO add authentication middelware once created

// TODO move this function to auth when file created
const hashPassword = async (plainPassword) => {
	return await bcrypt.hash(plainPassword, 10);
};

route.get('/', async (req, res) => {
	// Validation that the request have a query parameter named supplier and its value is either true or false
	if (!req.query.supplier) {
		res.status(406).json({
			detail: 'Query parameter supplier is required',
		});
		return;
	}

	if (
		req.query.supplier.toLowerCase() !== 'true' &&
		req.query.supplier.toLowerCase() !== 'false'
	) {
		res.status(406).json({
			detail: 'Query parameter supplier value must be true or false',
		});
		return;
	}

	const is_supplier = req.query.supplier.toLowerCase() === 'true';
	// End of validation

	const sql =
		'select uuid, email, is_supplier, name, phone from users where is_supplier = $1';
	const response = await client.query(sql, [is_supplier]);
	const responseData = [];

	for (index in response.rows) {
		const userResponse = response.rows[index];
		const userData = await formatOneUserResponse(userResponse);
		responseData.push(userData);
	}

	res.status(200).json({
		'total-results': response.rowCount,
		data: responseData,
	});
});

route.post('/', validateEmail, validatePassword, async (req, res) => {
	const userData = req.body;
	if (!req.body.email)
		return res.status(400).json({ detail: 'Email is a required property' });
	if (!req.body.password)
		return res
			.status(400)
			.json({ detail: 'Password is a required property' });
	if (!req.body.name)
		return res
			.status(400)
			.json({ detail: "User's name is a required property" });

	if (req.body.is_supplier === undefined)
		return res
			.status(400)
			.json({ detail: 'Have to specify if user is supplier' });

	if (!req.body.phone)
		return res
			.status(400)
			.json({ detail: "User's phone is a required property" });

	await client.query('BEGIN'); // Start a transaction nothing will be saved until a commit

	try {
		const userUUID = uuid.v4(); // Generates a new UUID to use in the user
		let sql =
			'insert into users (uuid, email, password, is_supplier, is_active, name, phone) values ($1, $2, $3, $4, $5, $6, $7)';

		// Hashes the password so we do not save passwords that anyone can read
		const hashedPassword = await hashPassword(userData.password);

		const values = [
			userUUID,
			userData.email,
			hashedPassword,
			userData.is_supplier,
			true || false,
			userData.name,
			userData.phone || null,
		];

		await client.query(sql, values); // Execute the query

		// If the request have an array of cities, then it saves them
		if (userData.cities && userData.cities.length > 0) {
			if (!(await saveCities(userData.cities, userUUID))) {
				await client.query('ROLLBACK');
				res.status(406).json({ detail: 'Invalid city uuid' });
				return;
			}
		}

		// If the request have an array of trades, then it saves them
		if (userData.trades && userData.trades.length > 0) {
			if (!(await saveTrades(userData.trades, userUUID))) {
				await client.query('ROLLBACK');
				res.status(406).json({ detail: 'Invalid trade uuid' });
				return;
			}
		}

		await client.query('COMMIT'); // Saves all the information to the database

		// if saving was succefsull then we get the saved information

		sql =
			'select uuid, email, is_supplier, name, phone from users where uuid = $1';
		const userResponse = await (await client.query(sql, [userUUID])).rows;

		const responseData = await formatOneUserResponse(userResponse[0]);

		// Sends it back to the user with a status code of 201
		res.status(201).json({
			data: responseData,
		});
	} catch (err) {
		await client.query('ROLLBACK'); // On any error it will rollback
		// Sends to the user the error information with a status code of 409
		res.status(409).json({
			detail: 'Conflict',
		});
	}
});

route.get('/:uuid', validateUUID, async (req, res) => {
	const userUUID = req.params.uuid;

	const sql =
		'select uuid, email, is_supplier, name, phone from users where uuid = $1';
	const userResponse = await client.query(sql, [userUUID]);

	if (userResponse.rowCount === 0) {
		res.status(404).json({
			detail: `User with uuid: ${userUUID} does not exist`,
		});
		return;
	}

	const responseData = await formatOneUserResponse(userResponse.rows[0]);

	res.status(200).json({
		data: responseData,
	});
});

route.put(
	'/:uuid',
	validateUUID,
	validateEmail,
	validatePassword,
	async (req, res) => {
		const userUUID = req.params.uuid;
		const userData = req.body;

		let sql =
			'select uuid, email, is_supplier, name, phone from users where uuid = $1';
		const userResponse = await client.query(sql, [userUUID]);

		if (userResponse.rowCount === 0) {
			res.status(404).json({
				detail: `User with uuid: ${userUUID} does not exist`,
			});
			return;
		}

		// Do not update values that are not sent to the backend
		const email = userData.email || userResponse.rows[0].email;
		const name = userData.name || userResponse.rows[0].name;
		const phone = userData.phone || userResponse.rows[0].phone;
		const is_supplier =
			userData.is_supplier === undefined
				? userResponse.rows[0].is_supplier
				: userData.is_supplier;

		let values = [];

		// Since we can not read the password then if the user doesn't send it then it will not update the password
		if (userData.password) {
			sql =
				'update users set email=$1, password=$2, name=$3, phone=$4, is_supplier=$5 where uuid=$6';

			const hashedPassword = await hashPassword(userData.password);

			values = [
				email,
				hashedPassword,
				name,
				phone,
				is_supplier,
				userUUID,
			];
		} else {
			sql =
				'update users set email=$1, name=$2, phone=$3, is_supplier=$4 where uuid=$5';

			values = [email, name, phone, is_supplier, userUUID];
		}

		try {
			await client.query('BEGIN');
			await client.query(sql, values);
			// If the request have an array of cities, then it saves them
			if (userData.cities && userData.cities.length > 0) {
				if (!(await saveCities(userData.cities, userUUID))) {
					await client.query('ROLLBACK');
					res.status(406).json({ detail: 'Invalid city uuid' });
					return;
				}
			}

			// If the request have an array of trades, then it saves them
			if (userData.trades && userData.trades.length > 0) {
				if (!(await saveTrades(userData.trades, userUUID))) {
					await client.query('ROLLBACK');
					res.status(406).json({ detail: 'Invalid trade uuid' });
					return;
				}
			}

			await client.query('COMMIT'); // Saves all the information to the database

			// if saving was succefsull then we get the saved information

			sql =
				'select uuid, email, is_supplier, name, phone from users where uuid = $1';
			const userResponse = await (
				await client.query(sql, [userUUID])
			).rows;

			const responseData = await formatOneUserResponse(userResponse[0]);

			res.status(200).json({
				data: responseData,
			});
		} catch (err) {
			await client.query('ROLLBACK');
			res.status(409).json({ detail: 'Conflict' });
		}
	}
);

module.exports = route;
