const request = require('supertest');
const baseUrl = require('../../app');
const client = require('../../src/config/db');
const { initializeDB } = require('../common/initializeDB');
const createUser = require('../common/create-user');
const createJobs = require('../common/create-jobs');
const createTrade = require('../common/create-trade');

const endpoint = '/proposals';
const invalidUUID = 'thisanin-vali-duui-dsoi-treturn404nf';
const inExistentUUID = 'a1bcdef2-1adc-d551-d701-74bacde40433';

let supplier, customer, trade, job;

describe('Test the Proposals Rout', () => {
	beforeAll(async () => {
		await initializeDB(client);

		customer = await (
			await createUser('customer@mail.com', 'Pas$wordForCust0mer', false)
		).body.data;

		supplier = await (
			await createUser('supplier@mail.com', 'Pas$W0rd', true)
		).body.data;

		trade = await (await createTrade('New trade')).body.data;

		job = await (
			await createJobs(
				trade.uuid,
				customer.uuid,
				'first job for this test'
			)
		).body.data;
	});
	afterAll(async () => {
		await client.end();
	});
	describe('Creating a proposal', () => {
		describe('Given the user send an invalid JSON', () => {
			it('should return 400 when the JSON is empty', async () => {
				const result = await request(baseUrl).post(endpoint).send({});

				expect(result.statusCode).toBe(400);
			});
			it('should return 400 when the user sends an invalid supplier_uuid', async () => {
				const result = await request(baseUrl)
					.post(endpoint)
					.send({ supplier_uuid: invalidUUID });

				expect(result.statusCode).toBe(400);
			});
			it('should return 400 when the user sends an invalid job_uuid', async () => {
				const result = await request(baseUrl).post(endpoint).send({
					supplier_uuid: supplier.uuid,
					job_uuid: invalidUUID,
				});

				expect(result.statusCode).toBe(400);
			});
			it('should return 400 when the user sends a non numeric price', async () => {
				const result = await request(baseUrl).post(endpoint).send({
					supplier_uuid: supplier.uuid,
					job_uuid: job.uuid,
					price: 'Invalid price',
				});

				expect(result.statusCode).toBe(400);
			});
			it('should return 400 when the user sends an invalid date', async () => {
				let result = await request(baseUrl).post(endpoint).send({
					supplier_uuid: supplier.uuid,
					job_uuid: job.uuid,
					price: 500,
					expiration_date: '2022-15-13',
				});

				expect(result.statusCode).toBe(400);

				result = await request(baseUrl).post(endpoint).send({
					supplier_uuid: supplier.uuid,
					job_uuid: job.uuid,
					price: 500,
					expiration_date: '2022-12-60',
				});

				expect(result.statusCode).toBe(400);

				result = await request(baseUrl).post(endpoint).send({
					supplier_uuid: supplier.uuid,
					job_uuid: job.uuid,
					price: 500,
					expiration_date: '1231231-12-15',
				});

				expect(result.statusCode).toBe(400);
			});
			it('should return 400 when the user sends a past date', async () => {
				const result = await request(baseUrl).post(endpoint).send({
					supplier_uuid: supplier.uuid,
					job_uuid: job.uuid,
					price: 500,
					expiration_date: '2020-12-13',
				});

				expect(result.statusCode).toBe(400);
			});
			it('should return 400 if the user is missing any field', async () => {
				let result = await request(baseUrl).post(endpoint).send({
					job_uuid: job.uuid,
					price: 500,
					expiration_date: '2023-12-13',
				});

				expect(result.statusCode).toBe(400);

				result = await request(baseUrl).post(endpoint).send({
					supplier_uuid: supplier.uuid,
					price: 500,
					expiration_date: '2023-12-13',
				});

				expect(result.statusCode).toBe(400);

				result = await request(baseUrl).post(endpoint).send({
					supplier_uuid: supplier.uuid,
					job_uuid: job.uuid,
					expiration_date: '2023-12-13',
				});

				expect(result.statusCode).toBe(400);

				result = await request(baseUrl).post(endpoint).send({
					supplier_uuid: supplier.uuid,
					job_uuid: job.uuid,
					price: 500,
				});

				expect(result.statusCode).toBe(400);
			});
		});
		describe('Given the user sends a valid JSON', () => {
			it('should return 404 when the user sends an nonexistent supplier_uuid', async () => {
				const result = await request(baseUrl).post(endpoint).send({
					supplier_uuid: inExistentUUID,
					job_uuid: job.uuid,
					price: 500,
					expiration_date: '2023-12-13',
				});

				expect(result.statusCode).toBe(404);
			});
			it('should return 404 when the user sends an nonexistent job_uuid', async () => {
				const result = await request(baseUrl).post(endpoint).send({
					supplier_uuid: supplier.uuid,
					job_uuid: inExistentUUID,
					price: 500,
					expiration_date: '2023-12-13',
				});

				expect(result.statusCode).toBe(404);
			});
			it('should return 201 if the proposal was created correctly', async () => {
				const result = await request(baseUrl).post(endpoint).send({
					supplier_uuid: supplier.uuid,
					job_uuid: job.uuid,
					price: 500,
					expiration_date: '2023-12-13',
				});

				expect(result.statusCode).toBe(201);

				const proposal = result.body.data;

				expect(proposal).toHaveProperty('price');
				expect(proposal.price).toBe(500);
				expect(proposal).toHaveProperty('expiration_date');
				expect(proposal.expiration_date).toBe(
					'2023-12-13T05:00:00.000Z'
				);
				expect(proposal).toHaveProperty('is_accepted');
				expect(proposal.is_accepted).toBe(false);
				expect(proposal).toHaveProperty('supplier');
				expect(proposal.supplier).toHaveProperty('uuid');
				expect(proposal.supplier.uuid).toBe(supplier.uuid);
				expect(proposal.supplier).not.toHaveProperty('password');
				expect(proposal.supplier).toHaveProperty('email');
				expect(proposal.supplier.email).toBe(supplier.email);
				expect(proposal.supplier).toHaveProperty('name');
				expect(proposal.supplier.name).toBe(supplier.name);
				expect(proposal.supplier).toHaveProperty('phone');
				expect(proposal.supplier.phone).toBe(supplier.phone);
			});
			it('should return 409 if the supplier is trying to create another proposal for the same job', async () => {
				const result = await request(baseUrl).post(endpoint).send({
					supplier_uuid: supplier.uuid,
					job_uuid: job.uuid,
					price: 500,
					expiration_date: '2023-12-13',
				});

				expect(result.statusCode).toBe(409);
			});
		});
	});
	describe('Getting the proposals', () => {
		describe('Given the user sends an invalid job_uuid', () => {
			it.todo('should return 400 if the user does not send the job uuid');
			it.todo('should return 400 if the user sends and invalid job uuid');
			it.todo(
				'should return 404 if the user sends a non existen job uuid'
			);
		});
		describe('Given the user sends a valid job_uuid', () => {
			it.todo('should return 200');
		});
		describe('Given the user sends a supplier_uuid', () => {
			it.todo(
				'should return 400 if the user sends and invalid supplier uuid'
			);
			it.todo(
				'should return 400 if the user sends a non existent supplier uuid'
			);
			it.todo(
				"should return 404 if the user sends a supplier_uuid that haven't sent a proposal"
			);
			it.todo(
				'should send a 200 if a proposal was found for that supplier in that job'
			);
		});
	});
	describe('Updating the proposal', () => {
		describe('Given the user sends an invalid job_uuid', () => {
			it.todo("should return 400 if the user doesn't send the job_uuid");
			it.todo('should return 400 if the user sends an invalid job_uuid');
			it.todo(
				'should return 404 if the user send a non existent job_uuid'
			);
		});
		describe('Given the user sends an invalid supplier_uuid', () => {
			it.todo(
				"should return 404 if the user doesn't send a supplier_uuid"
			);
			it.todo(
				'should return 400 if the user sends an invalid supplier_uuid'
			);
			it.todo(
				'should return 404 if the user sends a non existen supplier_uuid'
			);
		});
		describe('Given the user sends an invalid JSON', () => {
			it.todo('should return 400 if the user sends a non numeric price');
			it.todo('should return 400 if the user sends an invalid date');
			it.todo('should return 400 if the user sends a date in the past');
			it.todo('should return 400 if the is_accepted is not a boolean');
		});
		describe('Given the user sends a valid JSON', () => {
			it.todo('should return 200');
			describe('Given the user updates the is_accepted', () => {
				it.todo(
					'should return 200 and the job updated with the accepted supplier'
				);
			});
		});
	});
});
