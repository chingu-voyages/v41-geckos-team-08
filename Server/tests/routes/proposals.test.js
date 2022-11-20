const request = require('supertest');
const baseUrl = require('../../app');
const client = require('../../src/config/db');
const { initializeDB } = require('../common/initializeDB');
const createUser = require('../common/create-user');
const createJobs = require('../common/create-jobs');
const createTrade = require('../common/create-trade');
const login = require('../common/login');
const { TokenExpiredError } = require('jsonwebtoken');

const endpoint = '/api/proposals';
const invalidUUID = 'thisanin-vali-duui-dsoi-treturn404nf';
const inExistentUUID = 'a1bcdef2-1adc-d551-d701-74bacde40433';
const invalidTOKEN = 'thisis.aninvalidtokenthat.ivejustmadeup';

let supplier, customer, trade, job, supplier2, TOKEN, CUSTOMERTOKEN;

describe('Test the Proposals Route', () => {
	beforeAll(async () => {
		await initializeDB(client);

		customer = await (
			await createUser('customer@mail.com', 'Pas$wordForCust0mer', false)
		).body.data;

		supplier = await (
			await createUser('supplier@mail.com', 'Pas$W0rd', true)
		).body.data;

		supplier2 = await (
			await createUser('supplier2@mail.com', 'Pas$wordForCust0mer', true)
		).body.data;
		TOKEN = await (await login('supplier@mail.com', 'Pas$W0rd')).body.token;

		CUSTOMERTOKEN = await (
			await login('customer@mail.com', 'Pas$wordForCust0mer')
		).body.token;

		trade = await (await createTrade('New trade', TOKEN)).body.data;

		job = await (
			await createJobs(
				trade.uuid,
				customer.uuid,
				'first job for this test',
				CUSTOMERTOKEN
			)
		).body.data;
	});
	afterAll(async () => {
		await client.end();
	});
	describe('Creating a proposal', () => {
		describe('Given the user is not sending a token', () => {
			it('should return 403', async () => {
				const result = await request(baseUrl).post(endpoint).send({
					job_uuid: job.uuid,
					price: 500,
					expiration_date: '2023-12-13',
				});

				expect(result.statusCode).toBe(403);
			});
		});
		describe('Given the user is sending an invalid token', () => {
			it('should return 403', async () => {
				const result = await request(baseUrl)
					.post(endpoint)
					.send({
						job_uuid: job.uuid,
						price: 500,
						expiration_date: '2023-12-13',
					})
					.set('Authorization', `${invalidTOKEN}`);

				expect(result.statusCode).toBe(403);
			});
		});
		describe('Given the user send an invalid JSON', () => {
			it('should return 400 when the JSON is empty', async () => {
				const result = await request(baseUrl)
					.post(endpoint)
					.send({})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);
			});
			it('should return 400 when the user sends an invalid job_uuid', async () => {
				const result = await request(baseUrl)
					.post(endpoint)
					.send({
						job_uuid: invalidUUID,
					})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);
			});
			it('should return 400 when the user sends a non numeric price', async () => {
				const result = await request(baseUrl)
					.post(endpoint)
					.send({
						job_uuid: job.uuid,
						price: 'Invalid price',
					})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);
			});
			it('should return 400 when the user sends an invalid date', async () => {
				let result = await request(baseUrl)
					.post(endpoint)
					.send({
						job_uuid: job.uuid,
						price: 500,
						expiration_date: '2022-15-13',
					})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);

				result = await request(baseUrl)
					.post(endpoint)
					.send({
						job_uuid: job.uuid,
						price: 500,
						expiration_date: '2022-12-60',
					})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);

				result = await request(baseUrl)
					.post(endpoint)
					.send({
						job_uuid: job.uuid,
						price: 500,
						expiration_date: '1231231-12-15',
					})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);
			});
			it('should return 400 when the user sends a past date', async () => {
				const result = await request(baseUrl)
					.post(endpoint)
					.send({
						job_uuid: job.uuid,
						price: 500,
						expiration_date: '2020-12-13',
					})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);
			});
			it('should return 400 if the user is missing any field', async () => {
				let result = await request(baseUrl)
					.post(endpoint)
					.send({
						price: 500,
						expiration_date: '2023-12-13',
					})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);

				result = await request(baseUrl)
					.post(endpoint)
					.send({
						job_uuid: job.uuid,
						expiration_date: '2023-12-13',
					})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);

				result = await request(baseUrl)
					.post(endpoint)
					.send({
						job_uuid: job.uuid,
						price: 500,
					})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);
			});
		});
		describe('Given the user sends a valid JSON', () => {
			it('should return 401 if the user is a non supplier user', async () => {
				const customerToken = await (
					await login('customer@mail.com', 'Pas$wordForCust0mer')
				).body.token;
				const result = await request(baseUrl)
					.post(endpoint)
					.send({
						job_uuid: job.uuid,
						price: 500,
						expiration_date: '2023-12-13',
					})
					.set('Authorization', `${customerToken}`);

				expect(result.statusCode).toBe(401);
			});
			it('should return 404 when the user sends an nonexistent job_uuid', async () => {
				const result = await request(baseUrl)
					.post(endpoint)
					.send({
						job_uuid: inExistentUUID,
						price: 500,
						expiration_date: '2023-12-13',
						description: 'this is a description',
					})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(404);
			});
			it('should return 201 if the proposal was created correctly', async () => {
				const result = await request(baseUrl)
					.post(endpoint)
					.send({
						job_uuid: job.uuid,
						price: 500,
						expiration_date: '2023-12-13',
						description: 'This is a description',
					})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(201);

				const proposal = result.body.data;

				expect(proposal).toHaveProperty('price');
				expect(proposal.price).toBe(500);
				expect(proposal).toHaveProperty('expiration_date');
				expect(proposal.expiration_date).toBe(
					'2023-12-13T05:00:00.000Z'
				);
				expect(proposal).toHaveProperty('is_accepted');
				expect(proposal.is_accepted).toBe(null);
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
				const result = await request(baseUrl)
					.post(endpoint)
					.send({
						job_uuid: job.uuid,
						price: 500,
						expiration_date: '2023-12-13',
						description: 'This is a description',
					})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(409);
			});
		});
	});
	describe('Getting the proposals', () => {
		describe('Given the user is not sending a token', () => {
			it('should return 403', async () => {
				const result = await request(baseUrl).get(endpoint);

				expect(result.statusCode).toBe(403);
			});
		});
		describe('Given the user is sending an invalid token', () => {
			it('should return 403', async () => {
				const result = await request(baseUrl)
					.get(endpoint)
					.set('Authorization', `${invalidTOKEN}`);

				expect(result.statusCode).toBe(403);
			});
		});
		describe('Given the user sends an invalid job_uuid', () => {
			it('should return 400 if the user does not send the job uuid', async () => {
				const result = await request(baseUrl)
					.get(endpoint)
					.set('Authorization', `${CUSTOMERTOKEN}`);

				expect(result.statusCode).toBe(400);
			});
			it('should return 400 if the user sends and invalid job uuid', async () => {
				const result = await request(baseUrl)
					.get(endpoint)
					.query({ job: invalidUUID })
					.set('Authorization', `${CUSTOMERTOKEN}`);

				expect(result.statusCode).toBe(400);
			});
			it('should return 404 if the user sends a non existen job uuid', async () => {
				const result = await request(baseUrl)
					.get(endpoint)
					.query({ job: inExistentUUID })
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(404);
			});
		});
		describe('Given the user sends a valid job_uuid', () => {
			it('should return 200', async () => {
				const result = await request(baseUrl)
					.get(endpoint)
					.query({ job: job.uuid })
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(200);

				const proposals = result.body.data;

				proposals.forEach((proposal) => {
					expect(proposal).toHaveProperty('price');
					expect(proposal).toHaveProperty('expiration_date');
					expect(proposal).toHaveProperty('is_accepted');
					expect(proposal).toHaveProperty('supplier');
					expect(proposal.supplier).toHaveProperty('uuid');
					expect(proposal.supplier).not.toHaveProperty('password');
					expect(proposal.supplier).toHaveProperty('email');
					expect(proposal.supplier).toHaveProperty('name');
					expect(proposal.supplier).toHaveProperty('phone');
				});
			});
		});
		describe('Given the user sends a supplier_uuid', () => {
			describe('Given the user is not sending a token', () => {
				it('should return 403', async () => {
					const url = `${endpoint}/${supplier.uuid}`;
					const result = await request(baseUrl).get(url);

					expect(result.statusCode).toBe(403);
				});
			});
			describe('Given the user is sending an invalid token', () => {
				it('should return 403', async () => {
					const url = `${endpoint}/${supplier.uuid}`;
					const result = await request(baseUrl)
						.get(url)
						.set('Authorization', `${invalidTOKEN}`);

					expect(result.statusCode).toBe(403);
				});
			});
			it("should return 400 if the user doesn't send a job uuid", async () => {
				const url = `${endpoint}/${supplier.uuid}`;
				const result = await request(baseUrl)
					.get(url)
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);
			});
			it('should return 400 if the user sends and invalid job uuid', async () => {
				const url = `${endpoint}/${supplier.uuid}`;
				const result = await request(baseUrl)
					.get(url)
					.query({ job: invalidUUID })
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);
			});
			describe('Given the user sends a valid token', () => {
				it('should return 400 if the user sends and invalid supplier uuid', async () => {
					const url = `${endpoint}/${invalidUUID}`;
					const result = await request(baseUrl)
						.get(url)
						.query({ job: job.uuid })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(400);
				});
				it('should return 404 if the user sends a non existent supplier uuid', async () => {
					const url = `${endpoint}/${inExistentUUID}`;
					const result = await request(baseUrl)
						.get(url)
						.query({ job: job.uuid })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(404);
				});
				it("should return 404 if the user sends a supplier_uuid that haven't sent a proposal", async () => {
					const url = `${endpoint}/${supplier2.uuid}`;
					const result = await request(baseUrl)
						.get(url)
						.query({ job: job.uuid })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(404);
				});
				it('should send a 200 if a proposal was found for that supplier in that job', async () => {
					const url = `${endpoint}/${supplier.uuid}`;
					const result = await request(baseUrl)
						.get(url)
						.query({ job: job.uuid })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(200);

					const proposal = result.body.data;

					expect(proposal).toHaveProperty('price');
					expect(proposal).toHaveProperty('expiration_date');
					expect(proposal).toHaveProperty('is_accepted');
					expect(proposal).toHaveProperty('supplier');
					expect(proposal.supplier).toHaveProperty('uuid');
					expect(proposal.supplier).not.toHaveProperty('password');
					expect(proposal.supplier).toHaveProperty('email');
					expect(proposal.supplier).toHaveProperty('name');
					expect(proposal.supplier).toHaveProperty('phone');
				});
			});
		});
	});
	describe('Updating the proposal', () => {
		describe('Given the user is not sending a token', () => {
			it('should return 403', async () => {
				const url = `${endpoint}/${supplier.uuid}`;
				const result = await request(baseUrl).put(url).send({});

				expect(result.statusCode).toBe(403);
			});
		});
		describe('Given the user is sending an invalid token', () => {
			it('should return 403', async () => {
				const url = `${endpoint}/${supplier.uuid}`;
				const result = await request(baseUrl)
					.put(url)
					.send({})
					.set('Authorization', `${invalidTOKEN}`);

				expect(result.statusCode).toBe(403);
			});
		});
		describe('Given the user sends an invalid job_uuid', () => {
			it("should return 400 if the user doesn't send the job_uuid", async () => {
				const url = `${endpoint}/${supplier.uuid}`;
				const result = await request(baseUrl)
					.put(url)
					.send({})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);
			});
			it('should return 400 if the user sends an invalid job_uuid', async () => {
				const url = `${endpoint}/${supplier.uuid}`;
				const result = await request(baseUrl)
					.put(url)
					.query({ job: invalidUUID })
					.send({})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);
			});
			it('should return 404 if the user send a non existent job_uuid', async () => {
				const url = `${endpoint}/${supplier.uuid}`;
				const result = await request(baseUrl)
					.put(url)
					.query({ job: inExistentUUID })
					.send({})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(404);
			});
		});
		describe('Given the user sends an invalid supplier_uuid', () => {
			it('should return 400 if the user sends an invalid supplier_uuid', async () => {
				const url = `${endpoint}/${invalidUUID}`;
				const result = await request(baseUrl)
					.put(url)
					.query({ job: job.uuid })
					.send({})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);
			});
			it('should return 404 if the user sends a non existen supplier_uuid', async () => {
				const url = `${endpoint}/${inExistentUUID}`;
				const result = await request(baseUrl)
					.put(url)
					.query({ job: job.uuid })
					.send({})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(404);
			});
		});
		describe('Given the user sends an invalid JSON', () => {
			it('should return 400 if the user sends a non numeric price', async () => {
				const url = `${endpoint}/${supplier.uuid}`;
				const result = await request(baseUrl)
					.put(url)
					.query({ job: job.uuid })
					.send({ price: 'whatever value' })
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);
				expect(result.body.detail).toBe(
					'The price value must be numeric'
				);
			});
			it('should return 400 if the user sends an invalid date', async () => {
				const url = `${endpoint}/${supplier.uuid}`;
				let result = await request(baseUrl)
					.put(url)
					.send({
						expiration_date: '2022-15-13',
					})
					.query({ job: job.uuid })
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);
				expect(result.body.detail).toBe(
					'Invalid expiration date, it must be in the format YYYY-MM-DD'
				);

				result = await request(baseUrl)
					.put(url)
					.send({
						expiration_date: '2022-12-60',
					})
					.query({ job: job.uuid })
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);
				expect(result.body.detail).toBe(
					'Invalid expiration date, it must be in the format YYYY-MM-DD'
				);

				result = await request(baseUrl)
					.put(url)
					.send({
						expiration_date: '1231231-12-15',
					})
					.query({ job: job.uuid })
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);
				expect(result.body.detail).toBe(
					'Invalid expiration date, it must be in the format YYYY-MM-DD'
				);
			});
			it('should return 400 if the user sends a date in the past', async () => {
				const url = `${endpoint}/${supplier.uuid}`;
				let result = await request(baseUrl)
					.put(url)
					.send({
						expiration_date: '2020-12-13',
					})
					.query({ job: job.uuid })
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);
				expect(result.body.detail).toBe(
					'Expiration date can not be in the past'
				);
			});
			it('should return 400 if the is_accepted is not a boolean', async () => {
				const url = `${endpoint}/${supplier.uuid}`;
				const result = await request(baseUrl)
					.put(url)
					.query({ job: job.uuid })
					.send({ is_accepted: 'whatever value' })
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);
				expect(result.body.detail).toBe(
					'The is_accepted must be true or false'
				);
			});
		});
		describe('Given the user sends a valid JSON', () => {
			describe('Given the user is a supplier', () => {
				it('should return 401 if the user tries to update the is accepted', async () => {
					const url = `${endpoint}/${supplier.uuid}`;
					const result = await request(baseUrl)
						.put(url)
						.query({ job: job.uuid })
						.send({ is_accepted: true })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(401);
				});
				it('should return if it tries to update other suppliers proposal', async () => {
					const url = `${endpoint}/${supplier.uuid}`;
					const supplierToken = await (
						await login('supplier2@mail.com', 'Pas$wordForCust0mer')
					).body.token;

					let result = await request(baseUrl)
						.put(url)
						.query({ job: job.uuid })
						.send({ price: 455.76 })
						.set('Authorization', `${supplierToken}`);

					expect(result.statusCode).toBe(401);

					result = await request(baseUrl)
						.put(url)
						.query({ job: job.uuid })
						.send({ expiration_date: '2023-01-25' })
						.set('Authorization', `${supplierToken}`);

					expect(result.statusCode).toBe(401);
				});
				it("should return 200 if it doesn't update the is accepted", async () => {
					const url = `${endpoint}/${supplier.uuid}`;
					let result = await request(baseUrl)
						.put(url)
						.query({ job: job.uuid })
						.send({})
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(200);

					let proposal = result.body.data;

					expect(proposal).toHaveProperty('price');
					expect(proposal.price).toBe(500);
					expect(proposal).toHaveProperty('expiration_date');
					expect(proposal.expiration_date).toBe(
						'2023-12-13T05:00:00.000Z'
					);
					expect(proposal).toHaveProperty('is_accepted');
					expect(proposal.is_accepted).toBe(null);
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

					result = await request(baseUrl)
						.put(url)
						.query({ job: job.uuid })
						.send({ price: 455.76 })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(200);

					proposal = result.body.data;

					expect(proposal).toHaveProperty('price');
					expect(proposal.price).toBe(455.76);
					expect(proposal).toHaveProperty('expiration_date');
					expect(proposal.expiration_date).toBe(
						'2023-12-13T05:00:00.000Z'
					);
					expect(proposal).toHaveProperty('is_accepted');
					expect(proposal.is_accepted).toBe(null);
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

					result = await request(baseUrl)
						.put(url)
						.query({ job: job.uuid })
						.send({ expiration_date: '2023-01-25' })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(200);

					proposal = result.body.data;

					expect(proposal).toHaveProperty('price');
					expect(proposal.price).toBe(455.76);
					expect(proposal).toHaveProperty('expiration_date');
					expect(proposal.expiration_date).toBe(
						'2023-01-25T05:00:00.000Z'
					);
					expect(proposal).toHaveProperty('is_accepted');
					expect(proposal.is_accepted).toBe(null);
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
			});
			describe('Given the user updates is non supplier', () => {
				it('should return 401 if try to update any other field', async () => {
					const url = `${endpoint}/${supplier.uuid}`;
					let result = await request(baseUrl)
						.put(url)
						.query({ job: job.uuid })
						.send({ price: 455.76 })
						.set('Authorization', `${CUSTOMERTOKEN}`);

					expect(result.statusCode).toBe(401);

					result = await request(baseUrl)
						.put(url)
						.query({ job: job.uuid })
						.send({ expiration_date: '2023-01-25' })
						.set('Authorization', `${CUSTOMERTOKEN}`);

					expect(result.statusCode).toBe(401);
				});
				it('should return 200 and the job updated with the accepted supplier', async () => {
					const url = `${endpoint}/${supplier.uuid}`;
					const result = await request(baseUrl)
						.put(url)
						.query({ job: job.uuid })
						.send({ is_accepted: true })
						.set('Authorization', `${CUSTOMERTOKEN}`);

					expect(result.statusCode).toBe(200);

					const proposal = result.body.data;

					expect(proposal).toHaveProperty('price');
					expect(proposal.price).toBe(455.76);
					expect(proposal).toHaveProperty('expiration_date');
					expect(proposal.expiration_date).toBe(
						'2023-01-25T05:00:00.000Z'
					);
					expect(proposal).toHaveProperty('is_accepted');
					expect(proposal.is_accepted).toBe(true);
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

					const jobUrl = `/api/jobs/${job.uuid}`;
					const jobResult = await request(baseUrl)
						.get(jobUrl)
						.set('Authorization', `${TOKEN}`);

					expect(jobResult.statusCode).toBe(200);
					const updatedJob = jobResult.body.data;

					expect(updatedJob.is_taken).toBe(true);
					expect(updatedJob.supplier.uuid).toBe(supplier.uuid);
				});
			});
		});
	});
});
