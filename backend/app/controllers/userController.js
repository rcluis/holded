const mongoose = require('mongoose');
const User = require('../database/schemas/User');
const Company = require('../database/schemas/Company');
const Utils = require('../utils')();

module.exports = () => {
	return {
		getUsers: (async (req, res, next) => {
			try {
				const { id } = req.params;
				const { users } = await Company.findById(id).populate('users').exec();
				res.json({ data: users });
			} catch (error) {
				next(error);
			}
		}),
		addUser: (async (req, res, next) => {
			try {
				const { companyId, profilePicture, ...userAttributes } = req.body;
				if ((!companyId && companyId !== 0)) {
					return res.json(Utils.handleError('Invalid parameters'));
				}

				const newUser = new User({
					_id: new mongoose.Types.ObjectId(),
					profilePicture: Buffer.from(profilePicture, 'base64'),
					...userAttributes
				});

				const user = await newUser.save();
				await Company.findByIdAndUpdate(companyId, {$push: {users: user}});
				res.json(Utils.handleSuccess('User created successfully', user));
			} catch (error) {
				next(error);
			}
		}),
		editUser: (async (req, res, next) => {
			try {
				const {	userId,	update } = req.body;
				if ((!userId && userId !== 0) || !update) {
					return res.json(Utils.handleError('Invalid parameters'));
				}
				if (update.profilePicture) {
				    update.profilePicture = Buffer.from(profilePicture, 'base64');
                }
				const user = await User.findByIdAndUpdate(userId, update);
				res.json(Utils.handleSuccess('User edited successfully', user));
			} catch (error) {
				next(error);
			}
		}),
		removeUser: (async (req, res, next) => {
			try {
				const { userId,	companyId } = req.body;
				if ((!userId && userId !== 0) || (!companyId && companyId !== 0)) {
					return res.json(Utils.handleError('Invalid parameters'));
				}
				const user = await User.findById(userId);
				await user.remove();
				await Company.updateOne({ _id: companyId }, { $pull: { users: userId } });
				res.json(Utils.handleSuccess('User deleted successfully'));
			} catch (error) {
				next(error);
			}
		})
	}
};
