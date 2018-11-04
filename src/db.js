const bluebird = require('bluebird');
const mongoose = require('mongoose');
const logger = require('./util/logger');

module.exports = () => {
  mongoose.Promise = bluebird;
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('debug', true);
  mongoose.connect(process.env.MONGODB_URI + process.env.MONGODB_DATABASE, {
    useNewUrlParser: true,
  }).then(() => logger.info('MongoDB connection established'))
    .catch(error => logger.error(`MongoDB connection error: ${error}`));
};
