const request = require('supertest');
const baseUrl = require('../test-config');

const endpoint = '/locations';
let validUUID = '';

describe('Test the locations path', () => {
	describe('Test the countries', () => {
		test('It should return 200', async () => {
			const response = await request(baseUrl)
				.get(endpoint)
				.expect('Content-Type', /json/);

			validUUID =
				response.body.data[
					Math.floor(Math.random() * response.body.data.length)
				].uuid;

			expect(response.statusCode).toBe(200);
		});

		test('It should be an array of objects with UUID and description', async () => {
			const response = await request(baseUrl)
				.get(endpoint)
				.expect('Content-Type', /json/);

			expect(response.statusCode).toBe(200);
			expect(response.body.data.length).toBeGreaterThan(0);
			const randomResponse =
				response.body.data[
					Math.floor(Math.random() * response.body.data.length)
				];

			expect(randomResponse).toHaveProperty('uuid');
			expect(randomResponse).toHaveProperty('name');
		});
	});

	describe('Test the cities path', () => {
		describe('With bad UUID', () => {
			it('It should return 400 with invalid UUID', async () => {
				const url = `${endpoint}/thisanin-vali-duui-dsoi-treturn404nf`;
				const response = await request(baseUrl).get(url);

				expect(response.statusCode).toBe(400);
			});
			it('It should return 404 with valid UUID that is not in country', async () => {
				const badUUID = 'a1bcdef2-1adc-d551-d701-74bacde40433';
				const url = `${endpoint}/${badUUID}`;
				const response = await request(baseUrl).get(url);

				// console.log(response.body.detail);

				expect(response.statusCode).toBe(404);
				expect(response.body.detail).toBe(
					`No city with UUID: ${badUUID}`
				);
			});
		});
		describe('With good UUID', () => {
			let response;
			beforeEach(async () => {
				const url = `${endpoint}/${validUUID}`;
				response = await request(baseUrl).get(url);
			});
			it('It should return 200 with valid UUID that is a country', async () => {
				expect(response.statusCode).toBe(200);
			});
			it('It should be an array of objects with uuid and name properties', async () => {
				expect(response.statusCode).toBe(200);
				expect(response.body.data.length).toBeGreaterThan(0);

				const randomResponse =
					response.body.data[
						Math.floor(Math.random() * response.body.data.length)
					];

				expect(randomResponse).toHaveProperty('uuid');
				expect(randomResponse).toHaveProperty('name');
			});
		});
	});
});
