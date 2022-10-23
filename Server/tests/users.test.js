const request = require('supertest');
const baseUrl = require('../test-config');
const client = require('../src/config/db');

describe('Test the users path', () => {
	beforeAll(async () => {
		console.log('Deleting database information');
		// Clean the database as required
		let sql = 'delete from supplier_city';
		await client.query(sql);

		sql = 'delete from supplier_trade';
		await client.query(sql);

		sql = 'delete from proposal';
		await client.query(sql);

		sql = 'delete from job';
		await client.query(sql);

		sql = 'delete from trades';
		await client.query(sql);

		sql = 'delete from users';
		await client.query(sql);
	});
	afterAll(async () => {
		await client.end();
	});

	describe('Test for creating a user', () => {
		describe('Given the JSON body is incomplete', () => {
			it('should return 401 when not sending an invalid email', async () => {
				const response = await request(baseUrl)
					.post('/users')
					.send({ email: 'user' });
				expect(response.statusCode).toBe(401);
			});

			it('should return 400 when trying to create user with incomplete JSON', async () => {
				let response = await request(baseUrl)
					.post('/users')
					.send({ email: 'user@mail.com' });
				expect(response.statusCode).toBe(400);

				response = await request(baseUrl)
					.post('/users')
					.send({ email: 'user@mail.com', password: 'password123' });
				expect(response.statusCode).toBe(400);

				response = await request(baseUrl).post('/users').send({
					email: 'user@mail.com',
					password: 'password123',
					name: 'The name of the user',
				});
				expect(response.statusCode).toBe(400);

				response = await request(baseUrl).post('/users').send({
					email: 'user@mail.com',
					password: 'password123',
					name: 'The name of the user',
					is_supplier: true,
				});
				expect(response.statusCode).toBe(400);
			});
		});

		describe('Given the JSON body is complete', () => {
			it('should return 201 when creating a supplier', async () => {
				response = await request(baseUrl).post('/users').send({
					email: 'supplier@mail.com',
					password: 'password123',
					name: 'The name of the user',
					is_supplier: true,
					phone: '123 456 7890',
				});
				expect(response.statusCode).toBe(201);
				expect(response.body.data).toHaveProperty('uuid');
				expect(typeof response.body.data.uuid).toBe('string');
				expect(response.body.data).toHaveProperty('email');
				expect(typeof response.body.data.email).toBe('string');
				expect(response.body.data).toHaveProperty('name');
				expect(typeof response.body.data.name).toBe('string');
				expect(response.body.data).toHaveProperty('phone');
				expect(typeof response.body.data.phone).toBe('string');
				expect(response.body.data).toHaveProperty('is_supplier');
				expect(typeof response.body.data.is_supplier).toBe('boolean');
				expect(response.body.data).toHaveProperty('trades');
				expect(typeof response.body.data.trades).toBe('object');
				expect(response.body.data).toHaveProperty('cities');
				expect(typeof response.body.data.cities).toBe('object');
				expect(response.body.data).not.toHaveProperty('password');
			});
			it('should return 201 when creating a non supplier user', async () => {
				response = await request(baseUrl).post('/users').send({
					email: 'nonsupplier@mail.com',
					password: 'password123',
					name: 'The name of the user',
					is_supplier: false,
					phone: '123 456 7890',
				});
				expect(response.statusCode).toBe(201);
				expect(response.body.data).toHaveProperty('uuid');
				expect(typeof response.body.data.uuid).toBe('string');
				expect(response.body.data).toHaveProperty('email');
				expect(typeof response.body.data.email).toBe('string');
				expect(response.body.data).toHaveProperty('name');
				expect(typeof response.body.data.name).toBe('string');
				expect(response.body.data).toHaveProperty('phone');
				expect(typeof response.body.data.phone).toBe('string');
				expect(response.body.data).toHaveProperty('is_supplier');
				expect(typeof response.body.data.is_supplier).toBe('boolean');
				expect(response.body.data).toHaveProperty('trades');
				expect(typeof response.body.data.trades).toBe('object');
				expect(response.body.data).toHaveProperty('cities');
				expect(typeof response.body.data.cities).toBe('object');
				expect(response.body.data).not.toHaveProperty('password');
			});
			it('should return 409 when trying to create a user with existing email', async () => {
				response = await request(baseUrl).post('/users').send({
					email: 'supplier@mail.com',
					password: 'password123',
					name: 'The name of the user',
					is_supplier: true,
					phone: '123 456 7890',
				});
				expect(response.statusCode).toBe(409);

				response = await request(baseUrl).post('/users').send({
					email: 'nonsupplier@mail.com',
					password: 'password123',
					name: 'The name of the user',
					is_supplier: false,
					phone: '123 456 7890',
				});
				expect(response.statusCode).toBe(409);
			});
		});
	});

	describe('Getting all of the users', () => {
		describe('Given the supplier query parameter', () => {
			it('It should return 406 if it not exists', async () => {
				const response = await request(baseUrl)
					.get('/users')
					.expect('Content-Type', /json/);

				expect(response.statusCode).toBe(406);
				expect(response.body.detail).toBe(
					'Query parameter supplier is required'
				);
			});
			it('It should return 200 if it exists', async () => {
				const response = await request(baseUrl)
					.get('/users?supplier=true')
					.expect('Content-Type', /json/);

				expect(response.statusCode).toBe(200);
			});
		});
		describe('Given the supplier query parameter is false', () => {
			it('Should return only non suppliers', async () => {
				const response = await request(baseUrl).get(
					'/users?supplier=false'
				);

				const data = response.body.data;

				data.forEach((user) => {
					expect(user.is_supplier).toBe(false);
					expect(user).toHaveProperty('uuid');
					expect(typeof user.uuid).toBe('string');
					expect(user).toHaveProperty('email');
					expect(typeof user.email).toBe('string');
					expect(user).toHaveProperty('name');
					expect(typeof user.name).toBe('string');
					expect(user).toHaveProperty('phone');
					expect(typeof user.phone).toBe('string');
					expect(user).toHaveProperty('is_supplier');
					expect(typeof user.is_supplier).toBe('boolean');
					expect(user).toHaveProperty('trades');
					expect(typeof user.trades).toBe('object');
					expect(user).toHaveProperty('cities');
					expect(typeof user.cities).toBe('object');
					expect(user).not.toHaveProperty('password');
				});
			});
		});
		describe('Given the supplier query parameter is true', () => {
			it('Should return only suppliers', async () => {
				const response = await request(baseUrl).get(
					'/users?supplier=true'
				);

				const data = response.body.data;

				data.forEach((user) => {
					expect(user.is_supplier).toBe(true);
					expect(user).toHaveProperty('uuid');
					expect(typeof user.uuid).toBe('string');
					expect(user).toHaveProperty('email');
					expect(typeof user.email).toBe('string');
					expect(user).toHaveProperty('name');
					expect(typeof user.name).toBe('string');
					expect(user).toHaveProperty('phone');
					expect(typeof user.phone).toBe('string');
					expect(user).toHaveProperty('is_supplier');
					expect(typeof user.is_supplier).toBe('boolean');
					expect(user).toHaveProperty('trades');
					expect(typeof user.trades).toBe('object');
					expect(user).toHaveProperty('cities');
					expect(typeof user.cities).toBe('object');
					expect(user).not.toHaveProperty('password');
				});
			});
		});
	});

	describe('Getting one user', () => {
		let userUUID;

		beforeAll(async () => {
			const response = await request(baseUrl).get('/users?supplier=true');
			console.log(response.body);
			userUUID =
				response.body.data[
					Math.floor(Math.random() * response.body.data.length)
				].uuid;
		});
		describe('Given the UUID', () => {
			it('Should return 400 if the UUID is invalid', async () => {
				const url = `/users/thisanin-vali-duui-dsoi-treturn404nf`;
				const response = await request(baseUrl).get(url);

				expect(response.statusCode).toBe(400);
			});
			it('should return 400 with valid UUID inexistent in users', async () => {
				const badUUID = 'a1bcdef2-1adc-d551-d701-74bacde40433';
				const url = `/users/${badUUID}`;
				const response = await request(baseUrl).get(url);

				// console.log(response.body.detail);

				expect(response.statusCode).toBe(404);
			});
		});
	});
});
