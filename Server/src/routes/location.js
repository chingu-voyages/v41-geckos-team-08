const route = require('express').Router();

route.get('/', (req, res) => {
	res.json({
		data: 'Location working',
	});
});

module.exports = route;
