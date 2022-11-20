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
 * Given a job, it will return the formatted version of what the API is expected to return
 *
 * @param {job} jobUUID
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
			country_uuid: job.country_uuid
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

/**
 *
 * Given a job, it will return the formatted version of what the API is expected to return
 *
 * @param {proposal} proposal
 * @returns {FormatedResponse}
 */
const formatOneProposalResponse = (proposal) => {
	return {
		description: proposal.description,
		price: proposal.price,
		expiration_date: proposal.expiration_date,
		is_accepted: proposal.is_accepted,
		supplier: {
			uuid: proposal.supplier_uuid,
			email: proposal.supplier_email,
			name: proposal.supplier_name,
			phone: proposal.supplier_phone,
		},
		customer: {
			uuid: proposal.customer_uuid,
			email: proposal.customer_email,
			name: proposal.customer_name,
			phone: proposal.customer_phone,
		},
		trade: {
			uuid: proposal.trade_uuid,
			description: proposal.trade_description,
		},
		city: {
			uuid: proposal.city_uuid,
			name: proposal.city_name,
		},
		job: {
			uuid: proposal.job_uuid,
			description: proposal.job_description,
			is_taken: proposal.job_is_taken,
			is_completed: proposal.job_is_completed,
			low_price: proposal.job_low_price,
			high_price: proposal.job_high_price,
			expiration_date: proposal.job_expiration_date,
		},
	};
};

module.exports.formatOneUserResponse = formatOneUserResponse;
module.exports.formatOneJobRespnse = formatOneJobRespnse;
module.exports.formatOneProposalResponse = formatOneProposalResponse;
