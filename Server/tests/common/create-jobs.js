const request = require('supertest');
// const baseUrl = require('../../test-config');
const baseUrl = require('../../app');

const endpoint = '/jobs';

module.exports = async (trade, customer, description, TOKEN) => {
	const countries = await (
		await request(baseUrl).get('/locations')
	).body.data;

	const country = countries.find((pais) => pais.name === 'Ecuador');

	const cities = await (
		await request(baseUrl).get(`/locations/${country.uuid}`)
	).body.data;

	const city = cities.find((ciudad) => ciudad.name === 'Quito');

	return await request(baseUrl)
		.post(endpoint)
		.send({
			trade_uuid: trade,
			customer_uuid: customer,
			city_uuid: city.uuid,
			description,
			low_price: 0,
			high_price: 1000,
			expiration_date: '2023-10-12',
		})
		.set('Authorization', `Bearer ${TOKEN}`);
};
