const mongoose = require("mongoose");
const { Schema } = mongoose;

const CompanySchema = new Schema(
	{
		_id: Schema.Types.ObjectId,
		name: {
			type: String,
			required: true
		},
		users: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User'
			}
		]
	}
);

module.exports = mongoose.model("Companies", CompanySchema);
