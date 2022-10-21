const route = require("express").Router();
const client = require("../config/db.js");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../config/jwtGenerator.js");
const validator = require("../middleware/validator.js");
const userId = require("uuid");

const generatedUUID = userId.v4();

route.post("/register", validator, async (req, res) => {
	try {
		const { name, password, email, is_supplier, is_active, phone } = req.body;
		const uuid = generatedUUID;

		const user = await client.query("SELECT * FROM users WHERE email = $1", [
			email,
		]);
		if (user) {
			return res.status(400).json("User already exist.");
		}

		const saltRounds = 12;
		const salt = await bcrypt.genSalt(saltRounds);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = await client.query(
			"INSERT INTO USERS(uuid, name, email, password, is_supplier, is_active, phone)VALUES($1,$2,$3,$4,$5,$6,$7)RETURNING *",
			[uuid, name, hashedPassword, email, is_supplier, is_active, phone]
		);
		const token = jwtGenerator(newUser.rowCount.uuid);
		res.status(201).json({ token });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error.");
	}
});

module.exports = route;
