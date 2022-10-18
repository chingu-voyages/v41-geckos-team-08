const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./src/documentation/swagger.json')

const { port } = require('./environment')

const app = express()

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
	console.log(`Server started, listening on port ${port}`)
})
