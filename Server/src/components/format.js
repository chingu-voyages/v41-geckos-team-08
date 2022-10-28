const client = require('../config/db');

/**
 *
 * Given the UUID of a user, it will return the formatted version of what the API is expected to return
 *
 * @param {uuid} userUUID
 * @returns {FormatedResponse}
 */
const formatOneUserResponse = async (user) => {
	// Gets all of the trades a specific user has
	let sql =
		'select trades.uuid, trades.description from trades join supplier_trade on trades.uuid = supplier_trade.trades_uuid where supplier_trade.supplier_uuid = $1 order by trades.description';
	const trades = await (await client.query(sql, [user.uuid])).rows;

	// Get all of the cities a specific user has
	sql =
		'select city.uuid, city.name from city join supplier_city on city.uuid = supplier_city.city_uuid where supplier_city.supplier_uuid = $1 order by city.name';
	const cities = await (await client.query(sql, [user.uuid])).rows;

	// Formats the data so it is easy to use in the front end
	return {
		uuid: user.uuid,
		email: user.email,
		name: user.name,
		phone: user.phone,
		is_supplier: user.is_supplier,
		trades,
		cities,
	};
};

/**
 *
 * Given the UUID of a job, it will return the formatted version of what the API is expected to return
 *
 * @param {uuid} jobUUID
 * @returns {FormatedResponse}
 */
const formatOneJobRespnse = (job) => {
	const supplier = !job.supplier_uuid
		? null
		: {
				uuid: job.supplier_uuid,
				email: job.supplier_email,
				name: job.supplier_name,
				phone: job.supplier_phone,
		  };

	return {
		uuid: job.uuid,
		description: job.description,
		low_price: job.low_price,
		high_price: job.high_price,
		expiration_date: job.expiration_date,
		is_taken: job.is_taken,
		is_completed: job.is_completed,
		trade: {
			uuid: job.trades_uuid,
			description: job.trades_description,
		},
		city: {
			uuid: job.city_uuid,
			name: job.city_name,
		},
		customer: {
			uuid: job.customer_uuid,
			email: job.customer_email,
			name: job.customer_name,
			phone: job.customer_phone,
		},
		supplier,
	};
};

module.exports.formatOneUserResponse = formatOneUserResponse;
module.exports.formatOneJobRespnse = formatOneJobRespnse;
