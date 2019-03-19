const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompanySchema = new Schema(
	{
		id: Number,
		name: String,
		users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
	}
);

module.exports = mongoose.model("Companies", CompanySchema);
