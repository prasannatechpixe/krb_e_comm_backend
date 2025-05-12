const { Pool, Client } = require("pg");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const DATABASE = process.env.MDDATABASE;
const HOST = process.env.MDHOST;
const DBUSER = process.env.MDDBUSER;
const PASSWORD = process.env.MDPASSWORD;
const dialectType = process.env.MDDIALECT;
const PORT = process.env.MDPORT;

const client = new Pool({
	user: DBUSER,
	host: HOST,
	database: DATABASE,
	password: PASSWORD,
	port: PORT,
});

client.connect(function (err, data) {
	if (err) {
		console.trace(err);
	} else {
		console.log("Master Database connected successfully");
	}
})

module.exports = client;