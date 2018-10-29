const errorHandler = require('errorhandler');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('../util/logger');
const routes = require('./routes');

class ApiServer {
  constructor() {
    this.server = null;
  }

  run() {
    const app = express();

    app.use(errorHandler());
    app.use(bodyParser.json());

    app.use(morgan('Started :method ":url" for :remote-addr at :date[iso]', {
      immediate: true,
      stream: logger.stream,
    }));

    app.use(morgan('Completed :status :method ":url" for :remote-addr in :response-time ms', {
      stream: logger.stream,
    }));

    app.set('port', process.env.PORT || 3000);

    routes.forEach(config => app.use(config.path, config.router));

    this.server = http.createServer(app);

    this.server.listen(app.get('port'), () => {
      logger.info(`ApiServer is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`);
    });
  }
}

module.exports = ApiServer;
