const route = require('express').Router();
const client = require('../config/db');
const { isValidUUID } = require('../middleware/validateUUID');
const moment = require('moment');

route.get('/', async (req, res) => {
	if (!req.query.city)
		return res.status(406).json({ detail: 'You need to send the city' });

	const jobsSQL =
		'select job.uuid, job.trade_uuid, job.customer_uuid, job.supplier_uuid, job.city_uuid, job.description, job.low_price, job.high_price, job.expiration_date, job.is_taken, job.is_completed from job join city on job.city_uuid = city.uuid where city.name = $1';

	const jobsResponse = await client.query(jobsSQL, [req.query.city]);

	res.json({
		'total-result': jobsResponse.rowCount,
		data: jobsResponse.rows,
	});
});

route.post('/', async (req, res) => {
	const {
		trade_uuid,
		customer_uuid,
		city_uuid,
		description,
		low_price,
		high_price,
		expiration_date,
	} = req.body;

	if (!trade_uuid)
		return res
			.status(400)
			.json({ detail: 'The trade is a required property' });

	if (!customer_uuid)
		return res
			.status(400)
			.json({ detail: 'The customer is a required property' });

	if (!city_uuid)
		return res
			.status(400)
			.json({ detail: 'The city is a required property' });

	if (!description)
		return res
			.status(400)
			.json({ detail: 'The description is a required property' });

	if (!isValidUUID(trade_uuid))
		return res.status(400).json({ detail: 'Invalid trade uuid' });

	if (!isValidUUID(customer_uuid))
		return res.status(400).json({ detail: 'Invalid trade uuid' });

	if (!isValidUUID(city_uuid))
		return res.status(400).json({ detail: 'Invalid trade uuid' });

	if (description.length < 10)
		return res.status(400).json({
			detail: 'Description must be at least 10 characters long',
		});

	if (low_price !== undefined && typeof low_price !== 'number')
		return res.status(422).json({ detail: 'Low price must be a number' });

	if (high_price !== undefined && typeof high_price !== 'number')
		return res.status(422).json({ detail: 'High price must be a number' });

	if (!moment(expiration_date, 'YYYY-MM-DD', true).isValid())
		return res.status(422).json({
			detail: 'Invalid expiration date, it must be in the format YYYY-MM-DD',
		});

	res.status(200).json({ data: [] });
});

module.exports = route;
