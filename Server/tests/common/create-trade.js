const request = require('supertest');
// const baseUrl = require('../../test-config');
const baseUrl = require('../../app');

module.exports = async (trade) => {
	response = await request(baseUrl).post('/trades').send({
		description: trade,
	});

	return response;
};
