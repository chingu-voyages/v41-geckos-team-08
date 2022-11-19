const request = require('supertest');
// const baseUrl = require('../../test-config');
const baseUrl = require('../../app');

module.exports = async (trade, TOKEN) => {
	response = await request(baseUrl)
		.post('/api/trades')
		.send({
			description: trade,
		})
		.set('Authorization', `Bearer ${TOKEN}`);

	return response;
};
