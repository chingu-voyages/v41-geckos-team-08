const request = require('supertest');
// const baseUrl = require('../../test-config');
const baseUrl = require('../../app');
const client = require('../../src/config/db');
const { initializeDB } = require('../common/initializeDB');
const createUser = require('../common/create-user');
const login = require('../common/login');

const endpoint = '/api/trades';
const invalidTOKEN = 'thisis.aninvalidtokenthat.ivejustmadeup';
let tradeUUID, TOKEN;

describe('Trades routes', () => {
	beforeAll(async () => {
		await createUser('john@doe.com', 'Pas$w0rd123', true);

		TOKEN = await (await login('john@doe.com', 'Pas$w0rd123')).body.token;

		await initializeDB(client);
		await request(baseUrl)
			.post(endpoint)
			.send({ description: 'trade 1' })
			.set('Authorization', `${TOKEN}`);
		await request(baseUrl)
			.post(endpoint)
			.send({ description: 'trade 2' })
			.set('Authorization', `${TOKEN}`);
		await request(baseUrl)
			.post(endpoint)
			.send({ description: 'trade 3' })
			.set('Authorization', `${TOKEN}`);
		const trade = await request(baseUrl)
			.post(endpoint)
			.send({ description: 'trade 4' })
			.set('Authorization', `${TOKEN}`);

		tradeUUID = trade.body.data.uuid;

		await request(baseUrl)
			.post(endpoint)
			.send({ description: 'trade 5' })
			.set('Authorization', `${TOKEN}`);
		await request(baseUrl)
			.post(endpoint)
			.send({ description: 'trade 6' })
			.set('Authorization', `${TOKEN}`);
	});
	afterAll(async () => {
		await client.end();
	});

	describe('Test creating a trade', () => {
		it('should return 201 when a trade is created', async () => {
			const response = await request(baseUrl)
				.post(endpoint)
				.send({ description: 'Testing trade' })
				.set('Authorization', `${TOKEN}`);

			expect(response.statusCode).toBe(201);
			expect(response.body.data).toHaveProperty('uuid');
			expect(typeof response.body.data.uuid).toBe('string');
			expect(response.body.data).toHaveProperty('description');
			expect(typeof response.body.data.description).toBe('string');
		});
		it('should return 409 when trying to create an existent trade', async () => {
			const response = await request(baseUrl)
				.post(endpoint)
				.send({ description: 'Testing trade' })
				.set('Authorization', `${TOKEN}`);

			expect(response.statusCode).toBe(409);
		});
	});
	describe('Test getting the trades', () => {
		describe('Given you want to get all the trades', () => {
			it('should return 200', async () => {
				const response = await request(baseUrl)
					.get(endpoint)
					.set('Authorization', `${TOKEN}`);

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
			it('should return 200 if a trade is found', async () => {
				const url = `${endpoint}/${tradeUUID}`;
				const response = await request(baseUrl)
					.get(url)
					.set('Authorization', `${TOKEN}`);

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
			const url = `${endpoint}/thisanin-vali-duui-dsoi-treturn404nf`;
			const response = await request(baseUrl)
				.put(url)
				.set('Authorization', `${TOKEN}`);
			expect(response.statusCode).toBe(400);
		});
		it('should return 404 if no trade is found', async () => {
			const badUUID = 'a1bcdef2-1adc-d551-d701-74bacde40433';
			const url = `${endpoint}/${badUUID}`;
			const response = await request(baseUrl)
				.put(url)
				.set('Authorization', `${TOKEN}`);
			expect(response.statusCode).toBe(404);
		});
		it('should return 200 on a successfull update', async () => {
			const url = `${endpoint}/${tradeUUID}`;
			const response = await request(baseUrl)
				.put(url)
				.send({ description: 'updated trade' })
				.set('Authorization', `${TOKEN}`);

			expect(response.statusCode).toBe(200);
			expect(response.body.data.uuid).toBe(tradeUUID);
			expect(response.body.data.description).toBe('updated trade');
		});
	});
});
