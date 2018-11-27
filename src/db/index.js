const mongoose = require('mongoose');
const bluebird = require('bluebird');
const logger = require('../util/logger');

class DB {
  constructor(url) {
    this.url = url;
  }

  async connect() {
    mongoose.Promise = bluebird;
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('debug', process.env.NODE_ENV !== 'production');

    try {
      await mongoose.connect(this.url, { useNewUrlParser: true });
      logger.info('MongoDB connection established');
    } catch (error) {
      throw new Error(`MongoDB connection error: ${error.message}`);
    }
  }
}

module.exports = DB;
