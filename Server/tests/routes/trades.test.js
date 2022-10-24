const request = require('supertest');
const baseUrl = require('../../test-config');
const client = require('../../src/config/db');
const { initializeDB } = require('../common/initializeDB');

const endPoint = '/trades';
let tradeUUID;

describe('Trades routes', () => {
	beforeAll(async () => {
		await initializeDB(client);
		await request(baseUrl).post(endPoint).send({ description: 'trade 1' });
		await request(baseUrl).post(endPoint).send({ description: 'trade 2' });
		await request(baseUrl).post(endPoint).send({ description: 'trade 3' });
		tradeUUID = await (
			await request(baseUrl)
				.post(endPoint)
				.send({ description: 'trade 4' })
		).body.data.uuid;

		await request(baseUrl).post(endPoint).send({ description: 'trade 5' });
		await request(baseUrl).post(endPoint).send({ description: 'trade 6' });
	});
	afterAll(async () => {
		await client.end();
	});

	describe('Test creating a trade', () => {
		it('should return 201 when a trade is created', async () => {
			const response = await request(baseUrl)
				.post(endPoint)
				.send({ description: 'Testing trade' });

			expect(response.statusCode).toBe(201);
			expect(response.body.data).toHaveProperty('uuid');
			expect(typeof response.body.data.uuid).toBe('string');
			expect(response.body.data).toHaveProperty('description');
			expect(typeof response.body.data.description).toBe('string');
		});
		it('should return 409 when trying to create an existent trade', async () => {
			const response = await request(baseUrl)
				.post(endPoint)
				.send({ description: 'Testing trade' });

			expect(response.statusCode).toBe(409);
		});
	});
	describe('Test getting the trades', () => {
		describe('Given you want to get all the trades', () => {
			it('should return 200', async () => {
				const response = await request(baseUrl).get(endPoint);

				expect(response.statusCode).toBe(200);
				expect(typeof response.body.data).toBe('object');

				const trades = response.body.data;
				for (let i = 0; i < trades.length; i++) {
					const trade = trades[i];
					expect(typeof response).toBe('object');
					expect(trade).toHaveProperty('uuid');
					expect(typeof trade.uuid).toBe('string');
					expect(trade).toHaveProperty('description');
					expect(typeof trade.description).toBe('string');
				}
			});
		});
		describe('Given you pass a UUID', () => {
			it('should return 400 if the uuid is invalid', async () => {
				const url = `${endPoint}/thisanin-vali-duui-dsoi-treturn404nf`;
				const response = await request(baseUrl).get(url);
				expect(response.statusCode).toBe(400);
			});
			it('should return 404 if no trade is found', async () => {
				const badUUID = 'a1bcdef2-1adc-d551-d701-74bacde40433';
				const url = `${endPoint}/${badUUID}`;
				const response = await request(baseUrl).get(url);
				expect(response.statusCode).toBe(404);
			});
			it('should return 200 if a trade is found', async () => {
				const url = `${endPoint}/${tradeUUID}`;
				const response = await request(baseUrl).get(url);

				expect(response.statusCode).toBe(200);
				expect(response.body.data).toHaveProperty('uuid');
				expect(response.body.data.uuid).toBe(tradeUUID);
				expect(response.body.data).toHaveProperty('description');
				expect(response.body.data.description).toBe('trade 4');
			});
		});
	});
	describe('Testing updating the trade', () => {
		it('should return 400 if the uuid is invalid', async () => {
			const url = `${endPoint}/thisanin-vali-duui-dsoi-treturn404nf`;
			const response = await request(baseUrl).put(url);
			expect(response.statusCode).toBe(400);
		});
		it('should return 404 if no trade is found', async () => {
			const badUUID = 'a1bcdef2-1adc-d551-d701-74bacde40433';
			const url = `${endPoint}/${badUUID}`;
			const response = await request(baseUrl).put(url);
			expect(response.statusCode).toBe(404);
		});
		it('should return 200 on a successfull update', async () => {
			const url = `${endPoint}/${tradeUUID}`;
			const response = await request(baseUrl)
				.put(url)
				.send({ description: 'updated trade' });

			expect(response.statusCode).toBe(200);
			expect(response.body.data.uuid).toBe(tradeUUID);
			expect(response.body.data.description).toBe('updated trade');
		});
	});
});
