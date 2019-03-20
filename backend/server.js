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
			return res.json({ success: true, data });
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

	user.save(function (error, data) {
		if (error) {
			return res.json({
				success: false,
				error
			});
		}
		Company.findByIdAndUpdate(companyId, { $push: { users: user } }, (error) =>  {
			if (error) {
				return res.json({
					success: false,
					error
				});
			}
			return res.json({
				success: true,
				data
			});
		});
	});
});

router.put("/company/user/", (req, res) => {
	const {
		userId,
		update
	} = req.body;

	if ((!userId && userId !== 0) || !update) {
		return res.json({
			success: false,
			error: "INVALID INPUTS"
		});
	}
	User.findByIdAndUpdate(userId, update, error => {
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
	const {
		userId,
		companyId
	} = req.body;

	User.findById(userId, (error, user) => {
		if (error) {
			return res.json({
				success: true,
				error
			});
		}
		user.remove((error) => {
			if (error) {
				return res.json({
					success: true,
					error
				});
			}
			Company.updateOne({ _id: companyId }, { $pull: { users: userId } }, (error) => {
				if (error) {
					return res.json({
						success: true,
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

// add route with version for possible future versioned routes
app.use("/api/v1", router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
