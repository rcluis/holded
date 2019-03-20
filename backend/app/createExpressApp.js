const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes');

module.exports = () => express()
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json())
	.use('/api/v1', router)
	.use((error, req, res, next) => {
		res.status(error.status || 500).json({ error })
	});
