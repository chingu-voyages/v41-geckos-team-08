/** @type {import('jest').Config} */
const config = {
	verbose: true,
	globalSetup: '<rootDir>/node_modules/@databases/pg-test/jest/globalSetup',
	globalTeardown:
		'<rootDir>/node_modules/@databases/pg-test/jest/globalTeardown',
};

module.exports = config;
