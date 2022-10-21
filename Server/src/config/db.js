const { Client } = require("pg");

const {
	database_username,
	database_password,
	database_host,
	database_name,
	database_port,
} = require("../../environment.js");

const client = new Client({
	user: database_username,
	host: database_host,
	database: database_name,
	password: database_password,
	port: database_port,
});

client.connect((err) => {
	if (err) throw new Error((mesage = err));

	console.log("Database successfully connected");
});

module.exports = client;
