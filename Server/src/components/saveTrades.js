const client = require('../config/db');
const { isValidUUID } = require('../middleware/validateUUID');

/**
 *
 * Saves the trades that a supplier have
 *
 * @param {Array} trades
 * @param {uuid} supplier_uuid
 * @returns  {boolean} True if it was a success to save false if there was any problem
 */
const saveTrades = async (trades, supplier_uuid) => {
	try {
		let sql = 'delete from supplier_trade where supplier_uuid = $1';
		await client.query(sql, [supplier_uuid]);

		for (index in trades) {
			const trade = trades[index];
			console.log(trade);
			if (!isValidUUID(trade)) return false;
			console.log('is valid');
			sql =
				'insert into supplier_trade(trades_uuid, supplier_uuid) values ($1, $2)';
			await client.query(sql, [trade, supplier_uuid]);
		}

		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};
exports.saveTrades = saveTrades;
