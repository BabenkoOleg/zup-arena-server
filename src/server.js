const errorHandler = require('errorhandler');
const express = require('express');
const bodyParser = require('body-parser');
const loadVariables = require('./util/env');
const initDb = require('./db');
const logger = require('./util/logger');
const authenticate = require('./middlewares/authenticate');
const { requestLogger, responseLogger } = require('./util/morgan');

loadVariables();
initDb();

const server = express();

server.use(errorHandler());
server.use(bodyParser.json());
server.use(requestLogger);
server.use(authenticate);
server.use(responseLogger);
server.use('/docs', express.static('apidoc'));
server.set('port', process.env.PORT || 3000);

const routes = require('./routes');

routes.forEach(config => server.use(config.path, config.router));

server.use((error, req, res, next) => {
  res.status(500);
  const body = {
    status: false,
    error: 'Something went wrong',
  };
  if (process.env.NODE_ENV !== 'production') body.description = error.message;
  res.json(body);
  next();
});

server.listen(process.env.PORT || 3000, () => {
  logger.info(`ApiServer is running at http://localhost:${server.get('port')} in ${server.get('env')} mode`);
});
