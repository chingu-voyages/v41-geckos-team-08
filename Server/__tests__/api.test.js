const request = require('supertest');
const app = require('../app');

describe('Test the users path', () => {
	test('It should return 406', (done) => {
		return request(app)
			.get('/users')
			.then((response) => {
				expect(response.statusCode).toBe(406);
			});
		// const response = await request(app)
		// 	.get('/users')
		// 	.expect('Content-Type', /json/);

		// expect(response.statusCode).toBe(406);
		// expect(response.body.detail).toBe(
		// 	'Query parameter supplier is required'
		// );
		// done();
	});
	// it('should return 200', async () => {
	// 	const response = await request(baseUrl)
	// 		.get('/users?supplier=true')
	// 		.expect('Content-Type', /json/);

	// 	console.log(response.text['total-results']);
	// 	expect(response.statusCode).toBe(200);
	// });
});
