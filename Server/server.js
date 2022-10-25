const app = require('./app');
const { port } = require('./environment');

app.listen(port, () => {
	console.log(`Server started, listening on port ${port}`);
});
