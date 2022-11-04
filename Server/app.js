const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/documentation/swagger.json');
const cors = require('cors');

const login = require('./src/auth/login');
const jobs = require('./src/routes/jobs');
const locations = require('./src/routes/location');
const proposals = require('./src/routes/proposals');
const trades = require('./src/routes/trades');
const users = require('./src/routes/users');
const load = require('./src/load/load');
const me = require('./src/routes/me');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/login', login);
app.use('/jobs', jobs);
app.use('/locations', locations);
app.use('/proposals', proposals);
app.use('/trades', trades);
app.use('/users', users);
app.use('/load', load);
app.use('/me', me);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
