const { Client } = require("pg");

// const {
// 	database_username,
// 	database_password,
// 	database_host,
// 	database_name,
// 	database_port,
// } = require("../../environment");

// const client = new Client({
// 	user: database_username,
// 	host: database_host,
// 	database: database_name,
// 	password: database_password,
// 	port: database_port,
// });
const client = new Client({
	user: "postgres",
	password: "djfyahlinks2",
	host: "localhost",
	database: "test",
	port: 5432,
});

client.connect((err) => {
	if (err) throw new Error((mesage = err));

	console.log("Database successfully connected");
});

module.exports = client;
