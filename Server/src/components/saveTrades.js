const client = require('../config/db');
const uuid = require('uuid');

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

		for (let index in trades) {
			const trade = trades[index];

			sql = 'select uuid from trades where description = $1';
			const result = await client.query(sql, [trade]);

			let tradeUUID;

			if (result.rowCount == 0) {
				tradeUUID = uuid.v4();
				sql = 'insert into trades (uuid, description) values ($1, $2)';
				await client.query(sql, [tradeUUID, trade]);
			} else {
				tradeUUID = result.rows[0].uuid;
			}

			sql =
				'insert into supplier_trade(trades_uuid, supplier_uuid) values ($1, $2)';
			await client.query(sql, [tradeUUID, supplier_uuid]);
		}

		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};

module.exports.saveTrades = saveTrades;
