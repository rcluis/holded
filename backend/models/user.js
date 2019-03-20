const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
	{
		_id: Schema.Types.ObjectId,
		name: {
			type: String,
			required: true
		},
		surname: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		position: {
			type: String,
			required: true
		},
		office: {
			type: String,
			required: true
		},
		salary: {
			type: Number,
			required: true
		},
		workingHours: {
			type: Number,
			required: true
		},
		profilePicture: Buffer
	}
);

module.exports = mongoose.model("User", UserSchema);
