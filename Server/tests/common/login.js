const request = require('supertest');
const baseUrl = require('../../app');
const endpoint = '/login';

module.exports = async (email, password) => {
	response = await request(baseUrl).post(endpoint).send({
		email,
		password,
	});

	return response;
};
