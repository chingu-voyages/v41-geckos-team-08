const route = require('express').Router();

route.get('/', (req, res) => {
	res.json({
		data: 'Jobs working',
	});
});

module.exports = route;
