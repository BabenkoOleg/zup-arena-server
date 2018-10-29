const errorHandler = require('errorhandler');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./util/logger');
const routes = require('./api/routes');
const Env = require('./util/env');
const { requestLogger, responseLogger } = require('./util/morgan');

Env.loadVariables();

const server = express();

server.use(errorHandler());
server.use(bodyParser.json());
server.use(requestLogger);
server.use(responseLogger);
server.set('port', process.env.PORT || 3000);

routes.forEach(config => server.use(config.path, config.router));

server.listen(process.env.PORT || 3000, () => {
  logger.info(`ApiServer is running at http://localhost:${server.get('port')} in ${server.get('env')} mode`);
});
