const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes');
module.exports = () => express()
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json())
	.use(cors())
	.use('/api/v1', router)
	.use(function(req, res, next) {
		res.status(error.status || 500).json({ error });
		next();
	});
