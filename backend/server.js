const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Company = require('./models/company');

const API_PORT = 3001;
const app = express();

const router = express.Router();
const uri = 'mongodb+srv://holded:holded1234@cluster0-l5mwf.mongodb.net/holded?retryWrites=true';

mongoose.connect(
	uri,
	{ useNewUrlParser: true }
);

let db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format

// this is our get method
// this method fetches all available data in our database
router.get("/test", (req, res) => {
	Company.
	findOne({ name: 'Holded' }).
	populate('users').
	exec((err, data) => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true, data: data });
	});
});

// append /api for our http requests
app.use("/api/v1", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
