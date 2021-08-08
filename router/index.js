const express = require('express');
const router = require('./noteRouter');
const app = express();
app.use('/notes', router);

module.exports = app;