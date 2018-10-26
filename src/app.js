const bluebird = require('bluebird');
const errorHandler = require('errorhandler');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('./util/logger');
const secrets = require('./util/secrets');

mongoose.Promise = bluebird;
mongoose.set('useCreateIndex', true);
mongoose.set('debug', true);
mongoose.connect(secrets.MONGODB_URI, { useNewUrlParser: true })
  .then(() => logger.info('MongoDB connection established'))
  .catch(error => logger.error(`MongoDB connection error: ${error}`));

const app = express();

app.use(errorHandler());

app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.send('Hello World!!');
});

module.exports = app;
