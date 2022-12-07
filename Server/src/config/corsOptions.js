const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
	origin: allowedOrigins,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
	allowedHeaders: '*'
}

module.exports = corsOptions