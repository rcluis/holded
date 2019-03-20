const app = require('./app/createExpressApp.js')();
const mongoose = require('mongoose');
const port = 3001;
const url = 'mongodb+srv://holded:holded1234@cluster0-l5mwf.mongodb.net/holded?retryWrites=true';

mongoose.set('useFindAndModify', false);
mongoose.connect(
	url,
	{ useNewUrlParser: true }
);

mongoose
	.connection
	.on('error', error => {
		console.log(error);
	})
	.once('open', () => console.log(`MongoDB connected at ${url}`));

app.listen(port, () => console.log(`Listening on port ${port}`));
