const express = require("express");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./src/documentation/swagger.json");

//const { port } = require("./environment");
const port = process.env.PORT;
const login = require("./src/auth/login");
const jobs = require("./src/routes/jobs");
const locations = require("./src/routes/location");
const proposals = require("./src/routes/proposals");
const trades = require("./src/routes/trades");
const users = require("./src/routes/users");
const register = require("./src/auth/register");

const app = express();

//middleware
app.use(express.json());

app.use("/auth", register);
app.use("/auth", login);
app.use("/jobs", jobs);
app.use("/locations", locations);
app.use("/proposals", proposals);
app.use("/trades", trades);
app.use("/users", users);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
	console.log(`Server started, listening on port ${port}`);
});
