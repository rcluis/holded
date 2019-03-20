const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
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

// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
    console.log(req.body);
    const {
        companyId,
        name,
        surname,
        email,
        position,
        office,
        salary,
        workingHours,
        profilePicture
    } = req.body;

    if ((!companyId && companyId !== 0) ||
        !name ||
        !surname ||
        !email ||
        !position ||
        !office ||
        !salary ||
        !workingHours) {
        return res.json({
            success: false,
            error: "INVALID INPUTS"
        });
    }

	const user = new User({
		_id: new mongoose.Types.ObjectId(),
        name,
        surname,
        email,
        position,
        office,
        salary,
        workingHours,
        profilePicture
	});

	user.save(function (err) {
		if (err) return handleError(err);
        console.log('user created');
        return res.json({
            success: true,
            error: "USER CREATED"
        });
		// const company = new Company({
		// 	title: 'Casino Royale',
		// 	user: author._id    // assign the _id from the person
		// });

		// story1.save(function (err) {
		// 	if (err) return handleError(err);
		// 	// thats it!
		// });
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
