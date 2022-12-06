const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/documentation/swagger.json');
const cors = require('cors');
const { client, port } = require('./environment');

const login = require('./src/auth/login');
const jobs = require('./src/routes/jobs');
const locations = require('./src/routes/location');
const proposals = require('./src/routes/proposals');
const trades = require('./src/routes/trades');
const users = require('./src/routes/users');
const load = require('./src/load/load');
const me = require('./src/routes/me');

const app = express();
app.use(cors({
  origin: [`http://localhost:${client}`, `http://localhost:${port}`, 'https://handywork-clients.netlify.app'],
  methods: '*', 
  allowedHeaders: '*',
}));
app.use(express.json());

app.use('/api/login', login);
app.use('/api/jobs', jobs);
app.use('/api/locations', locations);
app.use('/api/proposals', proposals);
app.use('/api/trades', trades);
app.use('/api/users', users);
app.use('/api/load', load);
app.use('/api/me', me);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
