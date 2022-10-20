const route = require('express').Router();
const client = require('../config/db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const hashPassword = async (plainPassword) => {
	return await bcrypt.hash(plainPassword, 10);
};

route.get('/', (req, res) => {
	res.json({
		data: 'Users working',
	});
});

/**
 *
 * @param {Array} cities
 * @param {string} supplier_uuid
 * @param {Response} res
 */
const saveCities = async (cities, supplier_uuid, res) => {
	try {
		let sql = 'delete from supplier_city where supplier_uuid = $1';
		await client.query(sql, [supplier_uuid]);
		for (index in cities) {
			city = cities[index];

			sql =
				'insert into supplier_city (city_uuid, supplier_uuid) values ($1, $2)';
			await client.query(sql, [city, supplier_uuid]);
		}
	} catch (err) {
		res.status(406).json({
			detail: 'Invalid city uuid',
		});
	}
};

route.post('/', async (req, res) => {
	const userData = req.body;
	await client.query('BEGIN');

	try {
		const userUUID = uuid.v4();
		let sql =
			'insert into users (uuid, email, password, is_supplier, is_active, name, phone) values ($1, $2, $3, $4, $5, $6, $7)';

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

		await client.query(sql, values);

		if (userData.cities && userData.cities.length > 0) {
			await saveCities(cities, userUUID.res);
		}

		await client.query('COMMIT');

		sql =
			'select uuid, email, is_supplier, name, phone from users where uuid = $1';
		const userResponse = await (await client.query(sql, [userUUID])).rows;

		sql =
			'select trades.uuid, trades.description from trades join supplier_trade on trades.uuid = supplier_trade.trades_uuid where supplier_trade.supplier_uuid = $1';

		const trades = await (await client.query(sql, [userUUID])).rows;

		sql =
			'select city.uuid, city.name from city join supplier_city on city.uuid = supplier_city.city_uuid where supplier_city.supplier_uuid = $1';
		const cities = await (await client.query(sql, [userUUID])).rows;

		const responseData = {
			uuid: userResponse[0].uuid,
			email: userResponse[0].email,
			name: userResponse[0].name,
			phone: userResponse[0].phone,
			is_supplier: userResponse[0].is_supplier,
			trades,
			cities,
		};

		res.status(201).json({
			data: responseData,
		});
	} catch (err) {
		await client.query('ROLLBACK');
		console.error(err);
		res.status(409).json({
			detail: 'Conflict',
		});
	}
});

module.exports = route;
