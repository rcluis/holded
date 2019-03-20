const app = require('./app/createExpressApp.js')();
const mongoose = require('mongoose');
const router = require('./app/routes');
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

// add route with version for possible future versioned routes
app.use('/api/v1', router);
app.use((error, req, res, next) => {
	res.status(error.status || 500).json({ error })
});
app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));
