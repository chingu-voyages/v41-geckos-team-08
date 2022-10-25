const dotenv = require('dotenv');

dotenv.config();

if (process.env.NODE_ENV === 'test') {
	const path = './.env.test';
	dotenv.config({ path: path });
	module.exports.database_name = `${process.env.DATABASE_NAME}Test`;
	module.exports.port = 8081;
} else {
	console.log('Configuring environment');
	dotenv.config();
	module.exports.database_name = process.env.DATABASE_NAME;
	module.exports.port = process.env.PORT || 8888;
}

module.exports.database_username = process.env.DATABASE_USERNAME;
module.exports.database_port = process.env.DATABASE_PORT;
module.exports.database_password = process.env.DATABASE_PASSWORD;
module.exports.database_host = process.env.DATABASE_HOST;

module.exports.secret_key = process.env.SECRET_KEY;
