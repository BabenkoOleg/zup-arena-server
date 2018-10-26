const dotenv = require('dotenv');
const fs = require('fs');
const logger = require('./logger');

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
} else {
  logger.debug('Using .env.example file to supply config environment variables');
  dotenv.config({ path: '.env.example' });
}

module.exports.ENVIRONMENT = process.env.NODE_ENV;
