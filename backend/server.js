const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const User = require('./models/user');
const Company = require('./models/company');

const API_PORT = 3001;
const app = express();

const router = express.Router();
const uri = 'mongodb+srv://holded:holded1234@cluster0-l5mwf.mongodb.net/holded?retryWrites=true';

mongoose.set('useFindAndModify', false);
mongoose.connect(
	uri,
	{ useNewUrlParser: true }
);

let db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error"));

// parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get("/company/:name/users/", (req, res) => {
	const name = req.params.name;
	Company.
		findOne({ name }).
		populate('users').
		exec((error, data) => {
			if (error) {
				if (error) {
					return res.json({
						success: false,
						error
					});
				}
			}
			return res.json({ success: true, data: data });
		});
});

router.post("/company/user/", (req, res) => {
    const { companyId } = req.body;

    if ((!companyId && companyId !== 0)) {
        return res.json({
            success: false,
            error: "INVALID INPUTS"
        });
    }

	const user = new User({
		_id: new mongoose.Types.ObjectId(),
        ...req.body
	});

	user.save(function (error) {
		if (error) {
			return res.json({
				success: false,
				error
			});
		}
		Company.
			findOne({ _id: companyId }).
			exec((err, company) => {
				company.users.push(user);
				company.save((error) => {
					if (error) {
						return res.json({
							success: false,
							error
						});
					}
					return res.json({
						success: true
					});
				});
			});
	});
});

router.put("/company/user/", (req, res) => {
	const {
		_id,
		update
	} = req.body;

	if ((!_id && _id !== 0) || !update) {
		return res.json({
			success: false,
			error: "INVALID INPUTS"
		});
	}
	User.findOneAndUpdate({ _id }, update, error => {
		if (error) {
			return res.json({
				success: true,
				error
			});
		}
		return res.json({ success: true });
	});
});

router.delete("/company/user/", (req, res) => {
	// delete user
});

// add route with version for possible future versioned routes
app.use("/api/v1", router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
