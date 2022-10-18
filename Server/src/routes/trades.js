const route = require('express').Router();

route.get('/', (req, res) => {
	res.json({
		data: 'Trades working',
	});
});

module.exports = route;
