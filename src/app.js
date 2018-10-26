const errorHandler = require('errorhandler');
const express = require('express');
const morgan = require('morgan');
const logger = require('./util/logger');

const { User } = require('./models/index');

const app = express();

app.use(errorHandler());
app.use(morgan(':method :url HTTP/:http-version :status - :response-time ms', {
  stream: logger.stream,
}));

app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  User.count().then((c) => {
    res.send(`There are ${c} users!`);
  });
});

module.exports = app;
