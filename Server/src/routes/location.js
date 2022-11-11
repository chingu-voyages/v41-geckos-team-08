const route = require('express').Router();
const client = require('../config/db');
const validateUUID = require('../middleware/validateUUID');

// TODO Add authentication middleware once it is created

route.get('/', async (req, res) => {
	const sql = 'select uuid, name from countries order by name';

	const queryResponse = await client.query(sql);

	res.json({
		'total-results': queryResponse.rowCount,
		data: queryResponse.rows,
	});
});

route.get('/:uuid', validateUUID, async (req, res) => {
	const { name } = req.query;
	console.log(name);

	let sql, queryResponse;

	if (name) {
		sql =
			'select city.uuid, city.name, countries.uuid as country_uuid, countries.name as country_name from city join countries on city.country_uuid = countries.uuid where countries.uuid = $1 and lower(city.name) = $2 order by city.name';
		queryResponse = await client.query(sql, [
			req.params.uuid,
			name.toLowerCase(),
		]);
	} else {
		sql =
			'select city.uuid, city.name, countries.uuid as country_uuid, countries.name as country_name from city join countries on city.country_uuid = countries.uuid where countries.uuid = $1 order by city.name';

		queryResponse = await client.query(sql, [req.params.uuid]);
	}

	try {
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

		if (queryResponse.rowCount === 0)
			return res.status(404).json({
				detail: `No city with UUID: ${req.params.uuid}`,
			});

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
