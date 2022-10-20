const route = require('express').Router();
const client = require('../config/db');

// TODO Add authentication middleware once it is created

route.get('/', async (req, res) => {
	const sql = 'select uuid, name from countries order by name';

	const queryResponse = await client.query(sql);

	res.json({
		'total-results': queryResponse.rowCount,
		data: queryResponse.rows,
	});
});

route.get('/:uuid', async (req, res) => {
	const sql =
		'select city.uuid, city.name, countries.uuid as country_uuid, countries.name as country_name from city join countries on city.country_uuid = countries.uuid where countries.uuid = $1 order by city.name';

	try {
		const queryResponse = await client.query(sql, [req.params.uuid]);

		const formattedResponse = [];

		for (index in queryResponse.rows) {
			city = queryResponse.rows[index];
			formattedResponse.push({
				uuid: city.uuid,
				name: city.name,
				country: {
					uuid: city.country_uuid,
					name: city.country_name,
				},
			});
		}

		res.json({
			'total-results': queryResponse.rowCount,
			data: formattedResponse,
		});
	} catch (err) {
		res.status(404).json({
			detail: 'No cities for that country',
		});
	}
});

module.exports = route;
