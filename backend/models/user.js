const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		id: Number,
		name: String,
		surname: String,
		email: String,
		position: String,
		office: String,
		salary: Number,
		workingHours: Number,
		profilePicture: Buffer
	}
);

module.exports = mongoose.model("User", UserSchema);
