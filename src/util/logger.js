import * as logger from 'winston';

logger.configure({
  format: logger.format.combine(
    logger.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logger.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [
    new (logger.transports.Console)({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    }),
    new (logger.transports.File)({ filename: 'debug.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level');
}

export default logger;
