const errorHandler = require('errorhandler');
const express = require('express');
const morgan = require('morgan');
const logger = require('./util/logger');
const Router = require('./router');

const app = express();
const router = new Router(app);

app.use(errorHandler());
app.use(morgan('Started :method ":url" for :remote-addr at :date[iso]', {
  immediate: true,
  stream: logger.stream,
}));

app.use(morgan('Completed :method ":url" for :remote-addr in :response-time ms', {
  stream: logger.stream,
}));

router.loadRoutes();

app.set('port', process.env.PORT || 3000);

module.exports = app;
