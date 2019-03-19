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
db.on("error", console.error.bind(console, "MongoDB connection error:"));

router.get("/company/:name/users/", (req, res) => {
	const name = req.params.name;
	Company.
	findOne({ name }).
	populate('users').
	exec((err, data) => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true, data: data });
	});
});

router.post("/company/user/", (req, res) => {
	// add user
	const user = new Person({
		_id: new mongoose.Types.ObjectId(),
		name: 'Ian Fleming',
		age: 50
	});

	user.save(function (err) {
		if (err) return handleError(err);

		const company = new Company({
			title: 'Casino Royale',
			user: author._id    // assign the _id from the person
		});

		story1.save(function (err) {
			if (err) return handleError(err);
			// thats it!
		});
	});
});

router.post("/company/user/", (req, res) => {
	// edit user
});

router.delete("/company/user/", (req, res) => {
	// delete user
});

// append /api for our http requests
app.use("/api/v1", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
