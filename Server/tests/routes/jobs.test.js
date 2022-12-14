const request = require('supertest');
const baseUrl = require('../../app');
const client = require('../../src/config/db');
const { initializeDB } = require('../common/initializeDB');
const createUser = require('../common/create-user');
const createTrade = require('../common/create-trade');
const login = require('../common/login');

const endpoint = '/api/jobs';
let supplier, customer, trade, city, country, updateTrade, updateCity, TOKEN;
const invalidUUID = 'thisanin-vali-duui-dsoi-treturn404nf';
const inExistentUUID = 'a1bcdef2-1adc-d551-d701-74bacde40433';
const invalidTOKEN = 'thisis.aninvalidtokenthat.ivejustmadeup';

describe('Test jobs', () => {
	beforeAll(async () => {
		await initializeDB(client);

		supplier = await (
			await createUser('supplier@mail.com', 'Pas$W0rd123', true)
		).body.data;

		customer = await (
			await createUser('customer@mail.com', 'Pas$W0rd123', false)
		).body.data;

		TOKEN = await (
			await login('customer@mail.com', 'Pas$W0rd123')
		).body.token;

		trade = await (await createTrade('New trade', TOKEN)).body.data;
		updateTrade = await (
			await createTrade('another trade', TOKEN)
		).body.data;

		const countries = await (
			await request(baseUrl).get('/api/locations')
		).body.data;

		country = countries.find((pais) => pais.name === 'Ecuador');

		const cities = await (
			await request(baseUrl).get(`/api/locations/${country.uuid}`)
		).body.data;

		city = cities.find((ciudad) => ciudad.name === 'Quito');
		updateCity = cities.find((ciudad) => ciudad.name === 'Guayaquil');
	});
	afterAll(async () => {
		await client.end();
	});
	describe('Create a job', () => {
		describe('Given the user is not sending a token', () => {
			it('should return 403', async () => {
				const result = await request(baseUrl).post(endpoint).send({
					trade_uuid: trade.uuid,
					city_uuid: city.uuid,
					description: 'asdfghjklñdgdghdghd',
					high_price: 0,
					low_price: 0,
					expiration_date: '2023-12-15',
				});

				expect(result.statusCode).toBe(403);
			});
		});
		describe('Given the user is sending an invalid token', () => {
			it('should return 403', async () => {
				const result = await request(baseUrl)
					.post(endpoint)
					.send({
						trade_uuid: trade.uuid,
						city_uuid: city.uuid,
						description: 'asdfghjklñdgdghdghd',
						high_price: 0,
						low_price: 0,
						expiration_date: '2023-12-15',
					})
					.set('Authorization', `${invalidTOKEN}`);

				expect(result.statusCode).toBe(403);
			});
		});

		describe('Given a supplier is trying to create a job', () => {
			it('should return 401', async () => {
				const supplierToken = await login(
					'supplier@mail.com',
					'Pas$W0rd123'
				);
				const response = await request(baseUrl)
					.post(endpoint)
					.send({})
					.set('Authorization', `${supplierToken.body.token}`);

				expect(response.statusCode).toBe(401);
			});
		});

		describe('Given the json is incomplete', () => {
			it('should return 400 if there is no trade_uuid', async () => {
				const response = await request(baseUrl)
					.post(endpoint)
					.send({})
					.set('Authorization', `${TOKEN}`);

				expect(response.statusCode).toBe(400);
			});
			it('should return 400 if there is no city_uuid', async () => {
				const response = await request(baseUrl)
					.post(endpoint)
					.send({
						trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					})
					.set('Authorization', `${TOKEN}`);
				expect(response.statusCode).toBe(400);
			});
			it('should reurn 400 if there is no description', async () => {
				const response = await request(baseUrl)
					.post(endpoint)
					.send({
						trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
						city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					})
					.set('Authorization', `${TOKEN}`);
				expect(response.statusCode).toBe(400);
			});
		});
		describe('Given the json is complete', () => {
			it('should return 400 if trade_uuid is invalid', async () => {
				const response = await request(baseUrl)
					.post(endpoint)
					.send({
						trade_uuid: 'thisanin-vali-duui-dsoi-treturn404nf',
						city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
						description: 'asdfghjklñdgdghdghd',
						low_price: 0,
						high_price: 0,
						expiration_date: '2022-12-15',
					})
					.set('Authorization', `${TOKEN}`);
				expect(response.statusCode).toBe(400);
			});
			it('should return 400 if city_uuid is invalid', async () => {
				const response = await request(baseUrl)
					.post(endpoint)
					.send({
						trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
						city_uuid: 'thisanin-vali-duui-dsoi-treturn404nf',
						description: 'asdfghjklñdgdghdghd',
						low_price: 0,
						high_price: 0,
						expiration_date: '2022-12-15',
					})
					.set('Authorization', `${TOKEN}`);
				expect(response.statusCode).toBe(400);
			});
			it("should reurn 400 if there is no description doesn't have at least 10 characters", async () => {
				const response = await request(baseUrl)
					.post(endpoint)
					.send({
						trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
						city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
						description: 'asdfgh',
						low_price: 0,
						high_price: 0,
						expiration_date: '2022-12-15',
					})
					.set('Authorization', `${TOKEN}`);
				expect(response.statusCode).toBe(400);
			});
			it('should return 422 if the low price is not a number', async () => {
				const response = await request(baseUrl)
					.post(endpoint)
					.send({
						trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
						city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
						description: 'asdfghjklñdgdghdghd',
						low_price: 'ldalñjf',
						high_price: 0,
						expiration_date: '2022-12-15',
					})
					.set('Authorization', `${TOKEN}`);
				expect(response.statusCode).toBe(422);
			});
			it('should return 422 if the high price is not a number', async () => {
				const response = await request(baseUrl)
					.post(endpoint)
					.send({
						trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
						city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
						description: 'asdfghjklñdgdghdghd',
						high_price: 'ldalñjf',
						low_price: 0,
						expiration_date: '2022-12-15',
					})
					.set('Authorization', `${TOKEN}`);
				expect(response.statusCode).toBe(422);
			});
			it('should return 422 if the user sends an invalid date', async () => {
				let response = await request(baseUrl)
					.post(endpoint)
					.send({
						trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
						city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
						description: 'asdfghjklñdgdghdghd',
						high_price: 0,
						low_price: 0,
						expiration_date: '2022-13-15',
					})
					.set('Authorization', `${TOKEN}`);
				expect(response.statusCode).toBe(422);

				response = await request(baseUrl)
					.post(endpoint)
					.send({
						trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
						city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
						description: 'asdfghjklñdgdghdghd',
						high_price: 0,
						low_price: 0,
						expiration_date: '2022-12-50',
					})
					.set('Authorization', `${TOKEN}`);
				expect(response.statusCode).toBe(422);
				response = await request(baseUrl)
					.post(endpoint)
					.send({
						trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
						city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
						description: 'asdfghjklñdgdghdghd',
						high_price: 0,
						low_price: 0,
						expiration_date: '123456-12-15',
					})
					.set('Authorization', `${TOKEN}`);
				expect(response.statusCode).toBe(422);
			});
			it('should return 406 if the expiration date is in the past', async () => {
				response = await request(baseUrl)
					.post(endpoint)
					.send({
						trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
						city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
						description: 'asdfghjklñdgdghdghd',
						high_price: 0,
						low_price: 0,
						expiration_date: '2020-12-15',
					})
					.set('Authorization', `${TOKEN}`);
				expect(response.statusCode).toBe(406);
			});
			it('should return 201 if the job is created', async () => {
				const response = await request(baseUrl)
					.post(endpoint)
					.send({
						trade_uuid: trade.uuid,
						city_uuid: city.uuid,
						description: 'asdfghjklñdgdghdghd',
						high_price: 0,
						low_price: 0,
						expiration_date: '2023-12-15',
					})
					.set('Authorization', `${TOKEN}`);
				expect(response.statusCode).toBe(201);

				const job = response.body.data;
				expect(typeof job).toBe('object');
				expect(job).toHaveProperty('supplier');
				expect(job.supplier).toBe(null);
				expect(job).toHaveProperty('uuid');
				expect(job).toHaveProperty('description');
				expect(job).toHaveProperty('low_price');
				expect(job).toHaveProperty('high_price');
				expect(job).toHaveProperty('expiration_date');
				expect(job).toHaveProperty('is_taken');
				expect(job).toHaveProperty('is_completed');
			});
		});
	});
	describe('Getting all of the jobs', () => {
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
		describe('Given the city query parameter', () => {
			it('should return 406 when it does not exist', async () => {
				supplierToken = await (
					await login('supplier@mail.com', 'Pas$W0rd123')
				).body.token;
				const response = await request(baseUrl)
					.get(endpoint)
					.set('Authorization', `${supplierToken}`);

				expect(response.statusCode).toBe(406);
			});
			it('should return 200 if it exists', async () => {
				const url = `${endpoint}?city=quito`;
				const response = await request(baseUrl)
					.get(url)
					.set('Authorization', `${TOKEN}`);

				expect(response.statusCode).toBe(200);
				expect(typeof response.body.data).toBe('object');

				const jobs = response.body.data;

				jobs.forEach((job) => {
					expect(job).toHaveProperty('uuid');
					expect(job).toHaveProperty('description');
					expect(job).toHaveProperty('low_price');
					expect(job).toHaveProperty('high_price');
					expect(job).toHaveProperty('expiration_date');
					expect(job).toHaveProperty('is_taken');
					expect(job).toHaveProperty('is_completed');
					expect(job).toHaveProperty('trade');
					expect(job.trade).toHaveProperty('uuid');
					expect(job.trade).toHaveProperty('description');
					expect(job).toHaveProperty('customer');
					expect(job.customer).toHaveProperty('uuid');
					expect(job.customer).toHaveProperty('email');
					expect(job.customer).toHaveProperty('name');
					expect(job.customer).toHaveProperty('phone');
					expect(job).toHaveProperty('city');
					expect(job.city).toHaveProperty('uuid');
					expect(job.city).toHaveProperty('name');
					expect(job).toHaveProperty('supplier');
					expect(job.supplier).toBe(null);
				});
			});
		});
	});
	describe('Getting one job by its uuid', () => {
		let queryJob;
		beforeAll(async () => {
			const getJob = await request(baseUrl)
				.get(`${endpoint}?city=quito`)
				.set('Authorization', `${TOKEN}`);
			queryJob = getJob.body.data[0];
		});
		describe('Given the user is not sending a token', () => {
			it('should return 403', async () => {
				const url = `${endpoint}/${queryJob.uuid}`;
				const result = await request(baseUrl).get(url);

				expect(result.statusCode).toBe(403);
			});
		});
		describe('Given the user is sending an invalid token', () => {
			it('should return 403', async () => {
				const url = `${endpoint}/${queryJob.uuid}`;
				const result = await request(baseUrl)
					.get(url)
					.set('Authorization', `${invalidTOKEN}`);

				expect(result.statusCode).toBe(403);
			});
		});
		describe('Given they pass an invalid uuid', () => {
			it('should return 400', async () => {
				const url = `${endpoint}/thisanin-vali-duui-dsoi-treturn404nf`;
				const response = await request(baseUrl)
					.get(url)
					.set('Authorization', `${TOKEN}`);
				expect(response.statusCode).toBe(400);
			});
			it('should return 404 if no trade is found', async () => {
				const badUUID = 'a1bcdef2-1adc-d551-d701-74bacde40433';
				const url = `${endpoint}/${badUUID}`;
				const response = await request(baseUrl)
					.get(url)
					.set('Authorization', `${TOKEN}`);
				expect(response.statusCode).toBe(404);
			});
		});
		describe('Given they pass a valid uuid', () => {
			it('should return 200', async () => {
				const url = `${endpoint}/${queryJob.uuid}`;
				const response = await request(baseUrl)
					.get(url)
					.set('Authorization', `${TOKEN}`);

				expect(response.statusCode).toBe(200);

				const job = response.body.data;

				expect(job).toHaveProperty('uuid');
				expect(job).toHaveProperty('description');
				expect(job).toHaveProperty('low_price');
				expect(job).toHaveProperty('high_price');
				expect(job).toHaveProperty('expiration_date');
				expect(job).toHaveProperty('is_taken');
				expect(job).toHaveProperty('is_completed');
				expect(job).toHaveProperty('trade');
				expect(job.trade).toHaveProperty('uuid');
				expect(job.trade).toHaveProperty('description');
				expect(job).toHaveProperty('customer');
				expect(job.customer).toHaveProperty('uuid');
				expect(job.customer).toHaveProperty('email');
				expect(job.customer).toHaveProperty('name');
				expect(job.customer).toHaveProperty('phone');
				expect(job).toHaveProperty('city');
				expect(job.city).toHaveProperty('uuid');
				expect(job.city).toHaveProperty('name');
				expect(job).toHaveProperty('supplier');
				expect(job.supplier).toBe(null);
			});
		});
	});
	describe('Updating a job', () => {
		describe('Given a bad UUID', () => {
			// http://server/jobs/<uuid>
			it('Should return 400 if the UUID is invalid', async () => {
				const result = await request(baseUrl)
					.put(`${endpoint}/thisanin-vali-duui-dsoi-treturn404nf`)
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(400);
			});
			it('Shoud return 404 if the UUID does not exist', async () => {
				const result = await request(baseUrl)
					.put(`${endpoint}/a1bcdef2-1adc-d551-d701-74bacde40433`)
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(404);
			});
		});
		describe('Given an incomplete JSON', () => {
			let queryJob;
			beforeAll(async () => {
				queryJob = await (
					await request(baseUrl)
						.get(`${endpoint}?city=quito`)
						.set('Authorization', `${TOKEN}`)
				).body.data[0];
			});
			it('should return 200 if there is empty JSON', async () => {
				const url = `${endpoint}/${queryJob.uuid}`;
				const result = await request(baseUrl)
					.put(url)
					.send({})
					.set('Authorization', `${TOKEN}`);

				expect(result.statusCode).toBe(200);

				const job = result.body.data;

				expect(job).toHaveProperty('uuid');
				expect(job.uuid).toBe(queryJob.uuid);
				expect(job).toHaveProperty('description');
				expect(job.description).toBe(queryJob.description);
				expect(job).toHaveProperty('low_price');
				expect(job.low_price).toBe(queryJob.low_price);
				expect(job).toHaveProperty('high_price');
				expect(job.high_price).toBe(queryJob.high_price);
				expect(job).toHaveProperty('expiration_date');
				expect(job.expiration_date).toBe(queryJob.expiration_date);
				expect(job).toHaveProperty('is_taken');
				expect(job.is_taken).toBe(queryJob.is_taken);
				expect(job).toHaveProperty('is_completed');
				expect(job.is_completed).toBe(queryJob.is_completed);
				expect(job).toHaveProperty('trade');
				expect(job.trade).toHaveProperty('uuid');
				expect(job.trade.uuid).toBe(queryJob.trade.uuid);
				expect(job.trade).toHaveProperty('description');
				expect(job).toHaveProperty('customer');
				expect(job.customer).toHaveProperty('uuid');
				expect(job.customer).toHaveProperty('email');
				expect(job.customer).toHaveProperty('name');
				expect(job.customer).toHaveProperty('phone');
				expect(job).toHaveProperty('city');
				expect(job.city).toHaveProperty('uuid');
				expect(job.city).toHaveProperty('name');
				expect(job).toHaveProperty('supplier');
				expect(job.supplier).toBe(null);
			});

			describe('Given a trade UUID', () => {
				it('should return 400 if the trade UUID is invalid', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;
					const result = await request(baseUrl)
						.put(url)
						.send({ trade_uuid: invalidUUID })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(400);
				});
				it('should return 404 if the trade UUID does not exist', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;
					const result = await request(baseUrl)
						.put(url)
						.send({ trade_uuid: inExistentUUID })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(404);
				});
				it('should return 200 if the trade is updated', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;

					const result = await request(baseUrl)
						.put(url)
						.send({ trade_uuid: updateTrade.uuid })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(200);

					const job = result.body.data;

					expect(job.trade.uuid).toBe(updateTrade.uuid);
					expect(job.trade.description).toBe(updateTrade.description);
				});
			});
			describe('Given a city UUID', () => {
				it('should return 400 if the city UUID is invalid', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;
					const result = await request(baseUrl)
						.put(url)
						.send({ city_uuid: invalidUUID })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(400);
				});
				it('should return 404 if the city UUID does not exist', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;
					const result = await request(baseUrl)
						.put(url)
						.send({ city_uuid: inExistentUUID })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(404);
				});
				it('should return 200 if the trade is updated', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;

					const result = await request(baseUrl)
						.put(url)
						.send({ city_uuid: updateCity.uuid })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(200);

					const job = result.body.data;

					expect(job.city.uuid).toBe(updateCity.uuid);
					expect(job.city.description).toBe(updateCity.description);
				});
			});
			describe('Given a supplier UUID', () => {
				it('should return 400 if the supplier UUID is invalid', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;
					const result = await request(baseUrl)
						.put(url)
						.send({ supplier_uuid: invalidUUID })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(400);
				});
				it('should return 404 if the supplier UUID does not exist', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;
					const result = await request(baseUrl)
						.put(url)
						.send({ supplier_uuid: inExistentUUID })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(404);
				});
				it('should return 200 if the supplier is updated', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;

					const result = await request(baseUrl)
						.put(url)
						.send({ supplier_uuid: supplier.uuid })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(200);

					const job = result.body.data;

					expect(job).toHaveProperty('supplier');
					expect(job.supplier).not.toBe(null);
					expect(job.supplier.uuid).toBe(supplier.uuid);
					expect(job.supplier.email).toBe(supplier.email);
					expect(job.supplier.name).toBe(supplier.name);
					expect(job.supplier.phone).toBe(supplier.phone);
				});
			});
			describe('Given it the is_taken', () => {
				it('should return 406 if the value is not a boolean', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;
					const result = await request(baseUrl)
						.put(url)
						.send({ is_taken: 'whatever value' })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(406);
				});
				it('should return 200 if the value is  a boolean', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;
					let result = await request(baseUrl)
						.put(url)
						.send({ is_taken: true })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(200);
					expect(result.body.data.is_taken).toBe(true);

					result = await request(baseUrl)
						.put(url)
						.send({ is_taken: false })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(200);
					expect(result.body.data.is_taken).toBe(false);
				});
			});
			describe('Given it sends the is_completed', () => {
				it('should return 406 if the value is not a boolean', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;
					const result = await request(baseUrl)
						.put(url)
						.send({ is_completed: 'whatever value' })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(406);
				});
				it('should return 200 if the value is  a boolean', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;
					let result = await request(baseUrl)
						.put(url)
						.send({ is_completed: true })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(200);
					expect(result.body.data.is_completed).toBe(true);

					result = await request(baseUrl)
						.put(url)
						.send({ is_completed: false })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(200);
					expect(result.body.data.is_completed).toBe(false);
				});
			});
			describe('Given it sends the low_price', () => {
				it('should return 406 if the value is not a number', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;
					const result = await request(baseUrl)
						.put(url)
						.send({ low_price: 'whatever value' })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(406);
				});
				it('should return 200 if the value is a number', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;
					let result = await request(baseUrl)
						.put(url)
						.send({ low_price: 200 })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(200);
					expect(result.body.data.low_price).toBe(200);

					result = await request(baseUrl)
						.put(url)
						.send({ low_price: 200.53 })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(200);
					expect(result.body.data.low_price).toBe(200.53);
				});
			});
			describe('Given it sends the high_price', () => {
				it('should return 406 if the value is not a number', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;
					const result = await request(baseUrl)
						.put(url)
						.send({ high_price: 'whatever value' })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(406);
				});
				it('should return 200 if the value is a number', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;
					let result = await request(baseUrl)
						.put(url)
						.send({ high_price: 500 })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(200);
					expect(result.body.data.high_price).toBe(500);

					result = await request(baseUrl)
						.put(url)
						.send({ high_price: 500.45 })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(200);
					expect(result.body.data.high_price).toBe(500.45);
				});
			});
			describe('Given it sends the expiration_date', () => {
				it('should return 406 if the value is not a valid date', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;
					let result = await request(baseUrl)
						.put(url)
						.send({ expiration_date: 'whatever value' })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(406);

					result = await request(baseUrl)
						.put(url)
						.send({ expiration_date: '2022-13-15' })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(406);

					result = await request(baseUrl)
						.put(url)
						.send({ expiration_date: '2022-12-50' })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(406);

					result = await request(baseUrl)
						.put(url)
						.send({ expiration_date: '2022231-12-50' })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(406);

					result = await request(baseUrl)
						.put(url)
						.send({ expiration_date: '2020-12-15' })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(406);
				});
				it('should return 200 if the value is a valid date', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;
					const result = await request(baseUrl)
						.put(url)
						.send({ expiration_date: '2023-12-15' })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(200);
					expect(result.body.data.expiration_date).toBe(
						'2023-12-15T05:00:00.000Z'
					);
				});
			});
			describe('Given it sends a description', () => {
				it('should return 406 if its length is less than 10', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;
					const result = await request(baseUrl)
						.put(url)
						.send({ description: 'value' })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(406);
				});
				it('should return 200 if its length is greater than 10', async () => {
					const url = `${endpoint}/${queryJob.uuid}`;
					const result = await request(baseUrl)
						.put(url)
						.send({ description: 'this is a valid description' })
						.set('Authorization', `${TOKEN}`);

					expect(result.statusCode).toBe(200);
					expect(result.body.data.description).toBe(
						'this is a valid description'
					);
				});
			});
		});
	});
});
