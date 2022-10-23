const request = require('supertest');
const baseUrl = require('../../test-config');

module.exports = async (email, password, is_supplier) => {
	response = await request(baseUrl).post('/users').send({
		email: email,
		password: password,
		name: 'The name of the user',
		is_supplier: is_supplier,
		phone: '123 456 7890',
	});

	return response;
};
