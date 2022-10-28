const route = require('express').Router();
const { isValidUUID } = require('../middleware/validateUUID');
const moment = require('moment');

route.get('/', (req, res) => {
	res.json({
		data: 'Proposal working',
	});
});

route.post('/', (req, res) => {
	if (req.body.constructor === Object && Object.keys(req.body).length === 0)
		return res.status(400).json({ detail: "Haven't received any data" });

	const { supplier_uuid, job_uuid, price, expiration_date } = req.body;

	if (!expiration_date)
		return res.status(400).json({
			detail: 'The expiration date is a required field',
		});

	if (!isValidUUID(supplier_uuid))
		return res.status(400).json({ detail: 'Invalid supplier uuid' });

	if (!isValidUUID(job_uuid))
		return res.status(400).json({ detail: 'Invalid job uuid' });

	if (typeof price !== 'number')
		return res.status(400).json({ detail: 'The price must be numeric' });

	if (
		expiration_date &&
		!moment(expiration_date, 'YYYY-MM-DD', true).isValid()
	)
		return res.status(400).json({
			detail: 'Invalid expiration date, it must be in the format YYYY-MM-DD',
		});

	const expDate = moment(expiration_date, 'YYYY-MM-DD', true);
	const now = moment(new Date());

	if (expDate - now <= 0)
		return res
			.status(400)
			.json({ detail: 'Expiration date can not be in the past' });

	return res.sendStatus(202);
});

module.exports = route;
