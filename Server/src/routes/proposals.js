const route = require('express').Router();
const { isValidUUID } = require('../middleware/validateUUID');
const moment = require('moment');
const client = require('../config/db');
const { formatOneProposalResponse } = require('../components/format');
const validateUUID = require('../middleware/validateUUID');
const authorization = require('../middleware/authorization');

route.get('/', authorization, async (req, res) => {
	const { job } = req.query;
	const { is_supplier, user } = req.user;

	if (!is_supplier) {
		if (!job)
			return res.status(400).json({ detail: 'A job uuid is required' });
		if (!isValidUUID(job))
				return res.status(400).json({ detail: 'The job uuid needs to be valid' });
	}

	
	let proposalsResult;
	
	if (job) {
		const jobSQL = 'select * from job where uuid = $1';
		const jobResult = await client.query(jobSQL, [job]);
	
		if (jobResult.rowCount === 0)
			return res
				.status(404)
				.json({ detail: `There are no jobs with UUID: ${job}` });
		const proposalsSQL =
			'select proposal.price, proposal.expiration_date, proposal.is_accepted, supplier.uuid as supplier_uuid, supplier.name as supplier_name, supplier.email as supplier_email, supplier.phone as supplier_phone from proposal join users as supplier on proposal.supplier_uuid = supplier.uuid where proposal.job_uuid = $1';

		proposalsResult = await client.query(proposalsSQL, [job]);
	} else {
		const proposalsSQL =
			'select proposal.description, proposal.price, proposal.expiration_date, proposal.is_accepted, supplier.uuid as supplier_uuid, supplier.name as supplier_name, supplier.email as supplier_email, supplier.phone as supplier_phone from proposal join users as supplier on proposal.supplier_uuid = supplier.uuid where supplier.uuid = $1';

		proposalsResult = await client.query(proposalsSQL, [user]);
	}

	const allProposals = proposalsResult.rows;

	const proposalResponse = allProposals.map((oneJob) =>
		formatOneProposalResponse(oneJob)
	);

	res.status(200).json({
		data: proposalResponse,
	});
});

route.post('/', authorization, async (req, res) => {
	const { is_supplier, user } = req.user;

	if (!is_supplier)
		return res
			.status(401)
			.json({ detail: 'Only supplier users can create jobs' });

	const supplier_uuid = user;

	if (req.body.constructor === Object && Object.keys(req.body).length === 0)
		return res.status(400).json({ detail: "Haven't received any data" });

	const { description, job_uuid, price, expiration_date } = req.body;

	if (!isValidUUID(job_uuid))
		return res.status(400).json({ detail: 'Invalid job uuid' });

	if (typeof price !== 'number')
		return res.status(400).json({ detail: 'The price must be numeric' });

	if (!description)
		return res.status(400).json({
			detail: 'The description is a required field',
		});

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
			'insert into proposal(supplier_uuid, description, job_uuid, price, expiration_date, is_accepted) values ($1, $2, $3, $4, $5, $6)';

		console.log(0);
		await client.query(sql, [
			supplier_uuid,
			description,
			job_uuid,
			price,
			expiration_date,
			false,
		]);

		console.log(1);
		await client.query('COMMIT');

		const resultSQL =
			'select proposal.price, proposal.expiration_date, proposal.is_accepted, proposal.description, supplier.uuid as supplier_uuid, supplier.name as supplier_name, supplier.email as supplier_email, supplier.phone as supplier_phone from proposal join users as supplier on proposal.supplier_uuid = supplier.uuid where proposal.job_uuid = $1 and proposal.supplier_uuid = $2';
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

route.get('/:uuid', authorization, validateUUID, async (req, res) => {
	const { uuid } = req.params;
	const { job } = req.query;

	if (!job)
		return res.status(400).json({ detail: 'The job uuid is required' });

	if (!isValidUUID(job))
		return res
			.status(400)
			.json({ detail: `The job UUID: ${job} is invalid` });

	const supplierSQL =
		'select * from users where uuid = $1 and is_supplier=true';

	const supplierResult = await client.query(supplierSQL, [uuid]);

	if (supplierResult.rowCount === 0)
		return res.status(404).json({ detail: 'No supplier with that uuid' });

	const proposalSQL =
		'select proposal.price, proposal.expiration_date, proposal.is_accepted, supplier.uuid as supplier_uuid, supplier.name as supplier_name, supplier.email as supplier_email, supplier.phone as supplier_phone from proposal join users as supplier on proposal.supplier_uuid = supplier.uuid where proposal.job_uuid = $1 and supplier.uuid = $2';
	const proposalResult = await client.query(proposalSQL, [job, uuid]);

	if (proposalResult.rowCount === 0)
		return res.status(404).json({
			detail: `Supplier ${supplierResult.rows[0].name} havent sent a proposal yet`,
		});

	const proposalResponse = proposalResult.rows[0];

	res.status(200).json({ data: formatOneProposalResponse(proposalResponse) });
});

route.put('/:uuid', authorization, validateUUID, async (req, res) => {
	const { job } = req.query;
	const { is_supplier, user } = req.user;
	const { price, is_accepted, expiration_date } = req.body;
	const supplierUUID = req.params.uuid;

	if (!job) return res.status(400).json({ detail: 'A job uuid is required' });

	if (!isValidUUID(job))
		return res.status(400).json({ detail: 'The job uuid is invalid' });

	const jobSQL = 'select * from job where uuid = $1';
	const jobResult = await client.query(jobSQL, [job]);

	if (jobResult.rowCount === 0)
		return res
			.status(404)
			.json({ detail: `Job with UUID: ${job} does not exist` });

	const supplierSQL =
		'select * from users where uuid = $1 and is_supplier=true';
	const supplierResult = await client.query(supplierSQL, [supplierUUID]);

	if (supplierResult.rowCount === 0)
		return res.status(404).json({
			detail: `Supplier with UUID: ${supplierUUID} does not exist`,
		});

	if (price && typeof price !== 'number')
		return res
			.status(400)
			.json({ detail: 'The price value must be numeric' });

	if (price && supplierUUID != user)
		return res.status(401).json({
			detail: 'Only the supplier who created the proposal can update its price',
		});

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

	if (expiration_date && supplierUUID != user)
		return res.status(401).json({
			detail: 'Only the supplier who created the proposal can update its expiration date',
		});

	if (is_accepted !== undefined && typeof is_accepted !== 'boolean')
		return res
			.status(400)
			.json({ detail: 'The is_accepted must be true or false' });

	if (is_accepted !== undefined && is_supplier) {
		return res
			.status(401)
			.json({ detail: 'Only non suppliers can approve a proposal' });
	}
	try {
		await client.query('BEGIN');

		const existentProposal =
			'select price, is_accepted, expiration_date from proposal where job_uuid = $1 and supplier_uuid = $2';

		const resultExistentProposal = await client.query(existentProposal, [
			job,
			supplierUUID,
		]);

		if (resultExistentProposal.rowCount === 0)
			res.status(404).json({
				detail: `No proposal for supplier with UUID: ${supplierUUID} for the job with UUID: ${job}`,
			});

		const updatedPrice = price || resultExistentProposal.rows[0].price;
		const updatedIsAccepted =
			is_accepted === undefined
				? resultExistentProposal.rows[0].is_accepted
				: is_accepted;
		const updatedExpirationDate =
			expiration_date || resultExistentProposal.rows[0].expiration_date;

		const updateSQL =
			'update proposal set price=$1, is_accepted=$2, expiration_date=$3 where job_uuid = $4 and supplier_uuid = $5';
		await client.query(updateSQL, [
			updatedPrice,
			updatedIsAccepted,
			updatedExpirationDate,
			job,
			supplierUUID,
		]);

		if (is_accepted) {
			const updateJob =
				'update job set is_taken=true, supplier_uuid=$1 where uuid=$2';
			await client.query(updateJob, [supplierUUID, job]);
		}

		await client.query('COMMIT');

		const resultSQL =
			'select proposal.price, proposal.expiration_date, proposal.is_accepted, supplier.uuid as supplier_uuid, supplier.name as supplier_name, supplier.email as supplier_email, supplier.phone as supplier_phone from proposal join users as supplier on proposal.supplier_uuid = supplier.uuid where proposal.job_uuid = $1 and proposal.supplier_uuid = $2';
		const result = await (
			await client.query(resultSQL, [job, supplierUUID])
		).rows[0];

		const formatedResponse = formatOneProposalResponse(result);

		return res.status(200).json({ data: formatedResponse });
	} catch (err) {
		await client.query('ROLLBACK');
		console.log(err);
		return res.sendStatus(422);
	}
});

module.exports = route;
