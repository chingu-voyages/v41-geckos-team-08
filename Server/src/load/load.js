const router = require('express').Router();
const countries = require('./countries');
const uuid = require('uuid');
const client = require('../config/db');

router.get('/', async (req, res) => {
	const countryArray = [];

	await client.query('BEGIN');

	try {
		for (let i = 0; i < countries.length; i++) {
			const country = countries[i];
			const countryUuid = uuid.v4();

			const sql = 'insert into countries (uuid, name) values ($1, $2)';
			const values = [countryUuid, country.country];

			await client.query(sql, values);

			for (let j = 0; j < country.cities.length; j++) {
				const city = country.cities[j];
				const cityUuid = uuid.v4();

				const citySql =
					'insert into city (uuid, name, country_uuid) values ($1, $2, $3)';
				const cityValues = [cityUuid, city, countryUuid];
				await client.query(citySql, cityValues);
			}
		}

		await client.query('COMMIT');
	} catch (err) {
		await client.query('ROLLBACK');
		console.error(err);
	}
	res.json({
		total: countryArray.length,
		data: countryArray,
	});
});

module.exports = router;
