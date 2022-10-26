const route = require('express').Router();
const client = require('../config/db');
const { isValidUUID } = require('../middleware/validateUUID');
const moment = require('moment');
const uuid = require('uuid');
const { formatOneJobRespnse } = require('../components/format');

route.get('/', async (req, res) => {
	if (!req.query.city)
		return res.status(406).json({ detail: 'You need to send the city' });

	const jobsSQL =
		'select job.uuid, job.description, job.low_price, job.high_price, job.expiration_date, job.is_taken, job.is_completed, trades.uuid as trades_uuid, trades.description as trades_description, customer.uuid as customer_uuid, customer.email as customer_email, customer.name as customer_name, customer.phone as customer_phone, supplier.uuid as supplier_uuid, supplier.email as supplier_email, supplier.name as supplier_name, supplier.phone as supplier_phone, city.uuid as city_uuid, city.name as city_name from job left join trades on job.trade_uuid = trades.uuid left join users as customer on job.customer_uuid = customer.uuid left join users as supplier on job.supplier_uuid = supplier.uuid left join city on job.city_uuid = city.uuid where lower(city.name) = $1';

	const jobsResponse = await (
		await client.query(jobsSQL, [req.query.city.toLowerCase()])
	).rows;

	const formattedJobs = jobsResponse.map((job) => {
		const formatted = formatOneJobRespnse(job);

		return formatted;
	});

	res.json({
		'total-result': jobsResponse.rowCount,
		data: formattedJobs,
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

	const expDate = moment(expiration_date, 'YYYY-MM-DD', true);
	const now = moment(new Date());

	if (expDate - now <= 0)
		return res
			.status(406)
			.json({ detail: 'Expiration date can not be in the past' });

	const sql =
		'insert into job (uuid, trade_uuid, customer_uuid, city_uuid, description, low_price, high_price, expiration_date, is_taken, is_completed) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ';

	const jobUUID = uuid.v4();

	const values = [
		jobUUID,
		trade_uuid,
		customer_uuid,
		city_uuid,
		description,
		low_price,
		high_price,
		expiration_date,
		false,
		false,
	];

	try {
		await client.query('BEGIN');
		await client.query(sql, values);

		await client.query('COMMIT');
		const resultSql =
			'select job.uuid, job.description, job.low_price, job.high_price, job.expiration_date, job.is_taken, job.is_completed, trades.uuid as trades_uuid, trades.description as trades_description, customer.uuid as customer_uuid, customer.email as customer_email, customer.name as customer_name, customer.phone as customer_phone, supplier.uuid as supplier_uuid, supplier.email as supplier_email, supplier.name as supplier_name, supplier.phone as supplier_phone, city.uuid as city_uuid, city.name as city_name from job left join trades on job.trade_uuid = trades.uuid left join users as customer on job.customer_uuid = customer.uuid left join users as supplier on job.supplier_uuid = supplier.uuid left join city on job.city_uuid = city.uuid where job.uuid = $1';
		const job = await (await client.query(resultSql, [jobUUID])).rows[0];
		const formattedJob = formatOneJobRespnse(job);

		return res.status(201).json({ data: formattedJob });
	} catch (err) {
		await client.query('ROLLBACK');
		console.error(err);
		return res.status(409).json({ detail: 'Conflict' });
	}
});

module.exports = route;
