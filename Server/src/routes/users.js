const route = require('express').Router();

route.get('/', (req, res) => {
	res.json({
		data: 'Users working',
	});
});

module.exports = route;
