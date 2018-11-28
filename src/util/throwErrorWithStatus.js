const logger = require('./logger');

module.exports = (message, status) => {
  logger.error(message);

  const error = new Error(message);
  error.status = status;

  throw error;
};
