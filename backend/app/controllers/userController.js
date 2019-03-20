const mongoose = require('mongoose');
const User = require('../database/schemas/User');
const Company = require('../database/schemas/Company');

module.exports = () => {
	return {
		getUsers: (async (req, res, next) => {
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
		}),
		addUser: (async (req, res, next) => {
			try {
				const {companyId} = req.body;

				if ((!companyId && companyId !== 0)) {
					return res.json({
						success: false,
						error: "INVALID INPUTS"
					});
				}

				const newUser = new User({
					_id: new mongoose.Types.ObjectId(),
					...req.body
				});

				const user = await newUser.save();
				const result = await Company.findByIdAndUpdate(companyId, {$push: {users: user}});
				res.json({message: 'User created successfully', data: result});
			} catch (error) {
				next(error);
			}
		}),
		editUser: (async (req, res, next) => {
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
		}),
		removeUser: (async (req, res, next) => {
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
		})
	}
};
