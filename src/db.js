const bluebird = require('bluebird');
const mongoose = require('mongoose');
const logger = require('./util/logger');
const secrets = require('./util/secrets');

mongoose.Promise = bluebird;
mongoose.set('useCreateIndex', true);
mongoose.set('debug', true);
mongoose.connect(secrets.MONGODB_URI, { useNewUrlParser: true })
  .then(() => logger.info('MongoDB connection established'))
  .catch(error => logger.error(`MongoDB connection error: ${error}`));
