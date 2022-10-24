const initializeDB = async (client) => {
	console.log('Deleting database information');
	// Clean the database as required
	let sql = 'delete from supplier_city';
	await client.query(sql);

	sql = 'delete from supplier_trade';
	await client.query(sql);

	sql = 'delete from proposal';
	await client.query(sql);

	sql = 'delete from job';
	await client.query(sql);

	sql = 'delete from trades';
	await client.query(sql);

	sql = 'delete from users';
	await client.query(sql);
};
exports.initializeDB = initializeDB;
