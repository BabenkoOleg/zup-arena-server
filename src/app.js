const errorHandler = require('errorhandler');
const express = require('express');
const morgan = require('morgan');
const logger = require('./util/logger');

require('./db');

const app = express();

app.use(errorHandler());
app.use(morgan(':method :url HTTP/:http-version :status - :response-time ms', {
  stream: logger.stream,
}));

app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.send('Hello World!!');
});

module.exports = app;
