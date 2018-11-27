const dotenv = require('dotenv');
const fs = require('fs');
const logger = require('./logger');

class ENV {
  static load() {
    if (fs.existsSync('.env')) {
      logger.info('Using .env file to supply config environment variables');
      dotenv.config({ path: '.env' });
    } else {
      logger.info('Using .env.example file to supply config environment variables');
      dotenv.config({ path: '.env.example' });
    }
  }
}

module.exports = ENV;
