const morgan = require('morgan');
const logger = require('./logger');

morgan.token('remote-addr', (req) => {
  const xri = req.headers['x-real-ip'];
  const xff = req.headers['x-forwarded-for'];

  return xri || xff || req.connection.remoteAddress;
});

const requestLogFormat = 'Started :method ":url" for :remote-addr at :date[iso]';
module.exports.requestLogger = morgan(requestLogFormat, {
  immediate: true,
  stream: logger.stream,
});

const responseLogFormat = 'Completed :status :method ":url" for :remote-addr in :response-time ms';
module.exports.responseLogger = morgan(responseLogFormat, {
  stream: logger.stream,
});
