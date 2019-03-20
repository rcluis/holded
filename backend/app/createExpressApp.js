const express = require('express');
const bodyParser = require('body-parser');

module.exports = () => express()
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json())
	.use((error, req, res, next) => {
		res.status(error.status || 500).json({ error })
	});
