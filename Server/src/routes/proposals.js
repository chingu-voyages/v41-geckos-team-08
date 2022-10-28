const route = require('express').Router();
const { isValidUUID } = require('../middleware/validateUUID');
const moment = require('moment');
const client = require('../config/db');

route.get('/', (req, res) => {
	res.json({
		data: 'Proposal working',
	});
});

route.post('/', async (req, res) => {
	if (req.body.constructor === Object && Object.keys(req.body).length === 0)
		return res.status(400).json({ detail: "Haven't received any data" });

	const { supplier_uuid, job_uuid, price, expiration_date } = req.body;

	if (!isValidUUID(supplier_uuid))
		return res.status(400).json({ detail: 'Invalid supplier uuid' });

	if (!isValidUUID(job_uuid))
		return res.status(400).json({ detail: 'Invalid job uuid' });

	if (typeof price !== 'number')
		return res.status(400).json({ detail: 'The price must be numeric' });

	if (!expiration_date)
		return res.status(400).json({
			detail: 'The expiration date is a required field',
		});

	if (!moment(expiration_date, 'YYYY-MM-DD', true).isValid())
		return res.status(400).json({
			detail: 'Invalid expiration date, it must be in the format YYYY-MM-DD',
		});

	const expDate = moment(expiration_date, 'YYYY-MM-DD', true);
	const now = moment(new Date());

	if (expDate - now <= 0)
		return res
			.status(400)
			.json({ detail: 'Expiration date can not be in the past' });

	try {
		await client.query('COMMIT');

		const sql =
			'insert into proposal(supplier_uuid, job_uuid, price, expiration_date, is_accepted) values ($1, $2, $3, $4, $5)';

		await client.query(sql, [
			supplier_uuid,
			job_uuid,
			price,
			expiration_date,
			false,
		]);

		await client.query('COMMIT');

		return res.sendStatus(202);
	} catch (err) {
		await client.query('ROLLBACK');
		console.log(err);
		if (err.code === '23503')
			return res.status(404).json({ detail: err.detail });

		return res.status(422).json({ detail: 'Unprocessable entity' });
	}
});

module.exports = route;
