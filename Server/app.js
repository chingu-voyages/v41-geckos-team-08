const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/documentation/swagger.json');

const login = require('./src/auth/login');
const jobs = require('./src/routes/jobs');
const locations = require('./src/routes/location');
const proposals = require('./src/routes/proposals');
const trades = require('./src/routes/trades');
const users = require('./src/routes/users');
const load = require('./src/load/load');

const app = express();

app.use(express.json());

app.use('/login', login);
app.use('/jobs', jobs);
app.use('/locations', locations);
app.use('/proposals', proposals);
app.use('/trades', trades);
app.use('/users', users);
app.use('/load', load);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
	res.status(200).json({ data: 'Hello world!' });
});

module.exports = app;
