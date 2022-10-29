const route = require('express').Router();
const { isValidUUID } = require('../middleware/validateUUID');
const moment = require('moment');
const client = require('../config/db');
const { formatOneProposalResponse } = require('../components/format');

route.get('/', async (req, res) => {
	const { job } = req.query;
	if (!job) return res.status(400).json({ detail: 'A job uuid is required' });

	if (!isValidUUID(job))
		return res.status(400).json({ detail: 'The job uuid' });

	const jobSQL = 'select * from job where uuid = $1';
	const jobResult = await client.query(jobSQL, [job]);

	if (jobResult.rowCount === 0)
		return res
			.status(404)
			.json({ detail: `There are no jobs with UUID: ${job}` });

	const proposalsSQL =
		'select proposal.price, proposal.expiration_date, proposal.is_accepted, supplier.uuid as supplier_uuid, supplier.name as supplier_name, supplier.email as supplier_email, supplier.phone as supplier_phone from proposal join users as supplier on proposal.supplier_uuid = supplier.uuid where proposal.job_uuid = $1';

	const proposalsResult = await client.query(proposalsSQL, [job]);

	const allProposals = proposalsResult.rows;

	const proposalResponse = allProposals.map((oneJob) =>
		formatOneProposalResponse(oneJob)
	);

	res.status(200).json({
		data: proposalResponse,
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

		const resultSQL =
			'select proposal.price, proposal.expiration_date, proposal.is_accepted, supplier.uuid as supplier_uuid, supplier.name as supplier_name, supplier.email as supplier_email, supplier.phone as supplier_phone from proposal join users as supplier on proposal.supplier_uuid = supplier.uuid where proposal.job_uuid = $1 and proposal.supplier_uuid = $2';
		const result = await (
			await client.query(resultSQL, [job_uuid, supplier_uuid])
		).rows[0];

		const formatedResponse = formatOneProposalResponse(result);

		return res.status(201).json({ data: formatedResponse });
	} catch (err) {
		await client.query('ROLLBACK');
		// console.log(err);
		if (err.code === '23503')
			return res.status(404).json({ detail: err.detail });

		if (err.code === '23505')
			return res.status(409).json({ detail: 'Conflict' });

		return res.status(422).json({ detail: 'Unprocessable entity' });
	}
});

module.exports = route;
