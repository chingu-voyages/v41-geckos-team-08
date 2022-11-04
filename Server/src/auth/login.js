const route = require("express").Router();
const client = require("../config/db.js");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../middleware/jwtGenenrator.js");
const validateEmail = require("../middleware/validateEmail.js");
const validatePassword = require("../middleware/validatePassword.js");

route.post("/", validatePassword, validateEmail, async (req, res) => {
	try {
		//1 destructure the req.body
		const { email, password } = req.body;
		//2 check the user doesn't exist(if true throw error)

		if (!(email && password)) {
			res.status(400).send("All fields are required.");
		}
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
		const token = jwtGenerator(
			user.rows[0].uuid,
			user.rows[0].is_supplier,
			user.rows[0].email
		);
		res.status(200).json({ token });
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server error.");
	}
});

module.exports = route;
