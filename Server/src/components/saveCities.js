const client = require('../config/db');
const { isValidUUID } = require('../middleware/validateUUID');

/**
 *
 * Saves the cities where a user is registered
 *
 * @param {Array} cities
 * @param {uuid} supplier_uuid
 *
 * @returns {boolean} True if it was a success to save false if there was any problem
 */
const saveCities = async (cities, supplier_uuid) => {
	try {
		let sql = 'delete from supplier_city where supplier_uuid = $1';
		await client.query(sql, [supplier_uuid]);
		for (index in cities) {
			city = cities[index];

			if (!isValidUUID(city)) return false;

			sql =
				'insert into supplier_city (city_uuid, supplier_uuid) values ($1, $2)';
			await client.query(sql, [city, supplier_uuid]);
		}
		return true;
	} catch (err) {
		return false;
	}
};
exports.saveCities = saveCities;
