const route = require('express').Router();
const client = require('../config/db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const hashPassword = async (plainPassword) => {
	return await bcrypt.hash(plainPassword, 10);
};

/**
 *
 * Saves the trades that a supplier have
 *
 * @param {Array} trades
 * @param {uuid} supplier_uuid
 * @returns  {boolean} True if it was a success to save false if there was any problem
 */
const saveTrades = async (trades, supplier_uuid) => {
	try {
		let sql = 'delete from supplier_trade where supplier_uuid = $1';
		await client.query(sql, [supplier_uuid]);

		for (index in trades) {
			trade = trades[index];

			sql =
				'insert into supplier_trade(trade_uuid, supplier_uuid) values ($1, $2)';
			await client.query(sql, [trade, supplier_uuid]);
		}

		return true;
	} catch (err) {
		return false;
	}
};

/**
 *
 * Saves the cities where a user is registered
 *
 * @param {Array} cities
 * @param {uuid} supplier_uuid
 *
 * @returns {boolean} True if it was a success to save false if there was any problem
 */
const saveCities = async (cities, supplier_uuid) => {
	try {
		let sql = 'delete from supplier_city where supplier_uuid = $1';
		await client.query(sql, [supplier_uuid]);
		for (index in cities) {
			city = cities[index];

			sql =
				'insert into supplier_city (city_uuid, supplier_uuid) values ($1, $2)';
			await client.query(sql, [city, supplier_uuid]);
		}
		return true;
	} catch (err) {
		return false;
	}
};

/**
 *
 * Given the UUID of a user, it will return the formatted version of what the API is expected to return
 *
 * @param {uuid} userUUID
 * @returns {FormatedResponse}
 */
const formatOneUserResponse = async (user) => {
	// Gets all of the trades a specific user has
	let sql =
		'select trades.uuid, trades.description from trades join supplier_trade on trades.uuid = supplier_trade.trades_uuid where supplier_trade.supplier_uuid = $1';
	const trades = await (await client.query(sql, [user.uuid])).rows;

	// Get all of the cities a specific user has
	sql =
		'select city.uuid, city.name from city join supplier_city on city.uuid = supplier_city.city_uuid where supplier_city.supplier_uuid = $1';
	const cities = await (await client.query(sql, [user.uuid])).rows;

	// Formats the data so it is easy to use in the front end
	return {
		uuid: user.uuid,
		email: user.email,
		name: user.name,
		phone: user.phone,
		is_supplier: user.is_supplier,
		trades,
		cities,
	};
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

route.post('/', async (req, res) => {
	const userData = req.body;
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
			true,
			userData.name,
			userData.phone,
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
		console.error(err);
		// Sends to the user the error information with a status code of 409
		res.status(409).json({
			detail: 'Conflict',
		});
	}
});

module.exports = route;
