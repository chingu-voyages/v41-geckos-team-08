const request = require('supertest');
const baseUrl = require('../../app');
const endpoint = '/api/login';

module.exports = async (email, password) => {
	response = await request(baseUrl).post(endpoint).send({
		email,
		password,
	});

	return response;
};
