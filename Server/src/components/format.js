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
module.exports.formatOneUserResponse = formatOneUserResponse;
