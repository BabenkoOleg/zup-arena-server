const winston = require('winston');

const level = process.env.LOG_LEVEL || 'debug';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(i => `${i.timestamp} ${i.level[0].toUpperCase()}: ${i.message}`),
  ),
  level,
  transports: [
    new winston.transports.Console(),
  ],
});

logger.stream = {
  write: (message) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

logger.info(`Logging initialized at ${level} level`);

module.exports = logger;
