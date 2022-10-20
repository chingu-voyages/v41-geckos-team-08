const route = require("express").Router();
const client = require("../config/db.js");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../config/jwtGenerator.js");
const validator = require("../middleware/validator.js");
//const authorization = require("../middleware/authorization.js");

route.post("/login", validator, async (req, res) => {
	try {
		//1 destructure the req.body
		const { email, password } = req.body;
		//2 check the user doesn't exist(if true throw error)

		const user = await client.query("SELECT * FROM users WHERE email = $1", [
			email,
		]);

		if (user.rows.length === 0) {
			return res.status(401).json("User does not exist.");
		}
		//3 check if password matches stored password(if false throw error)
		const validPassword = await bcrypt.compare(password, user.rows[0].password);
		if (!validPassword) {
			return res.status(401).json("Password is incorrect.");
		}
		//4 give access
		const token = jwtGenerator(user.rows[0].uuid);
		res.status(200).json({ token });
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server error.");
	}
});

// route.get("/is-verified", authorization, async (req, res) => {
// 	try {
// 		res.json(true);
// 	} catch (error) {
// 		console.error(error.message);
// 		res.status(500).send("Server Error.");
// 	}
// });

module.exports = route;
