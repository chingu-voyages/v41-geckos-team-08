const request = require('supertest');
const baseUrl = require('../../app');
const client = require('../../src/config/db');
const { initializeDB } = require('../common/initializeDB');
const createUser = require('../common/create-user');
const login = require('../common/login');

const endpoint = '/api/me';

describe('Given the user access the me end point', () => {
	beforeAll(async () => {
		await initializeDB(client);
	});
	afterAll(async () => {
		await client.end();
	});
	it("should return 403 if the user don't send a token", async () => {
		await createUser('supplier@mail.com', 'Pas$w0rd123', true);

		const supplierResult = await request(baseUrl).get(endpoint);

		expect(supplierResult.statusCode).toBe(403);
	});
	it('Should return the user information when accessing the me endpoint', async () => {
		await createUser('supplier2@mail.com', 'Pas$w0rd123', true);

		const supplierToken = await (
			await login('supplier2@mail.com', 'Pas$w0rd123')
		).body.token;

		console.log('Token: ', supplierToken);
		console.log('Endpoint: ', endpoint);

		const supplierResult = await request(baseUrl)
			.get(endpoint)
			.set('Authorization', `${supplierToken}`);

		expect(supplierResult.statusCode).toBe(200);

		const supplier = supplierResult.body.data;

		expect(supplier).toHaveProperty('uuid');
		expect(typeof supplier.uuid).toBe('string');
		expect(supplier).toHaveProperty('email');
		expect(typeof supplier.email).toBe('string');
		expect(supplier).toHaveProperty('name');
		expect(typeof supplier.name).toBe('string');
		expect(supplier).toHaveProperty('phone');
		expect(typeof supplier.phone).toBe('string');
		expect(supplier).toHaveProperty('is_supplier');
		expect(typeof supplier.is_supplier).toBe('boolean');
		expect(supplier).toHaveProperty('trades');
		expect(typeof supplier.trades).toBe('object');
		expect(supplier).toHaveProperty('cities');
		expect(typeof supplier.cities).toBe('object');
		expect(supplier).not.toHaveProperty('password');
	});
});
