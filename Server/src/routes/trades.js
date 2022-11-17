const route = require('express').Router();
const uuid = require('uuid');
const client = require('../config/db');
const validateUUID = require('../middleware/validateUUID');
const authorization = require('../middleware/authorization.js');

route.get('/', authorization, async (req, res) => {
	const sql = 'select uuid, description from trades';

	const trades = await client.query(sql);

	res.json({
		'total-results': trades.rowCount,
		data: trades.rows,
	});
});

route.post('/', async (req, res) => {
	if (!req.body.description)
		return res.status(400).json({ detail: 'A description is needed' });

	const description = req.body.description;
	await client.query('BEGIN');

	try {
		const tradeUUID = uuid.v4();
		const sql =
			'insert into trades (uuid, description) values ($1, $2) returning uuid, description';

		const values = [tradeUUID, description];

		const insertedTrade = await client.query(sql, values);
		await client.query('COMMIT');
		res.status(201).json({ data: insertedTrade.rows[0] });
	} catch (err) {
		await client.query('ROLLBACK');
		// console.error(err);
		res.status(409).json({ detail: 'Trade already exists' });
	}
});

route.get('/:uuid', authorization, validateUUID, async (req, res) => {
	const tradeUUID = req.params.uuid;

	const sql = 'select uuid, description from trades where uuid = $1';
	const trade = await client.query(sql, [tradeUUID]);

	if (trade.rowCount === 0)
		return res
			.status(404)
			.json({ detail: `No trade with UUID: ${tradeUUID}` });

	res.status(200).json({ data: trade.rows[0] });
});

route.put('/:uuid', authorization, validateUUID, async (req, res) => {
	const tradeUUID = req.params.uuid;

	let sql = 'select uuid, description from trades where uuid = $1';
	const trade = await client.query(sql, [tradeUUID]);

	if (trade.rowCount === 0)
		return res
			.status(404)
			.json({ detail: `No trade with UUID: ${tradeUUID}` });

	try {
		await client.query('BEGIN');
		sql =
			'update trades set description = $1 where uuid = $2 returning uuid, description';
		const description = req.body.description || trade.rows[0].description;
		const updatedTrade = await client.query(sql, [description, tradeUUID]);
		await client.query('COMMIT');
		res.status(200).json({ data: updatedTrade.rows[0] });
	} catch (err) {
		await client.query('ROLLBACK');
		console.error(err);
		res.status(409).json({ detail: 'Trade already exists' });
	}
});

module.exports = route;
