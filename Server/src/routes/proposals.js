const route = require('express').Router();

route.get('/', (req, res) => {
	res.json({
		data: 'Proposal working',
	});
});

module.exports = route;
