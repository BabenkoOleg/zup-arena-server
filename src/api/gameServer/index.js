const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const express = require('express');
const cors = require('cors');
const ENV = require('../../util/env');

ENV.load();

const logger = require('../../util/logger');
const authenticate = require('./middlewares/authenticate');
const { requestLogger, responseLogger } = require('../../util/morgan');
const DB = require('../../db');

const run = async () => {
  const db = new DB(process.env.MONGODB_URI + process.env.MONGODB_DATABASE);

  const server = express();
  server.use(errorHandler());
  server.use(cors());
  server.use(bodyParser.json());
  server.use(requestLogger);
  server.use(authenticate);
  server.use(responseLogger);
  server.set('port', process.env.GAME_SERVER_PORT || 3000);

  const routes = require('./routes');
  routes.forEach(config => server.use(config.path, config.router));

  server.use((error, request, response, next) => {
    response.status(error.status || 500);
    response.json({ error: error.message });
    next();
  });

  try {
    await db.connect();

    await server.listen(process.env.GAME_SERVER_PORT);
    logger.info(`GameServer is running at http://localhost:${server.get('port')}`);
  } catch (error) {
    logger.error(`GameServer running error: ${error.message}`);
  }
};

run();
