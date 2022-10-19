const route = require('express').Router();

route.get('/', (req, res) => {
	res.json({
		data: 'Login working',
	});
});

module.exports = route;
