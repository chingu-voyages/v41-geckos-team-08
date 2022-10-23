const request = require('supertest');
const baseUrl = require('../test-config');

describe('Test the users path', () => {
	it('It should return 406', async () => {
		const response = await request(baseUrl)
			.get('/users')
			.expect('Content-Type', /json/);

		expect(response.statusCode).toBe(406);
		expect(response.body.detail).toBe(
			'Query parameter supplier is required'
		);
	});
	it('should return 200', async () => {
		const response = await request(baseUrl)
			.get('/users?supplier=true')
			.expect('Content-Type', /json/);

		expect(response.statusCode).toBe(200);
	});
});
