const socket = require('socket.io');
const logger = require('../util/logger');

const onAuthenticationHandler = require('./eventHandlers/authentication');

class WebSocketServer {
  constructor(server) {
    this.server = server;
  }

  run() {
    const io = socket(this.server);
    io.origins('*:*');
    io.on('connection', (client) => {
      client.authenticated = false;
      logger.debug('user connected');

      client.on('authentication', onAuthenticationHandler(io, client));

      client.on('disconnect', () => {
        logger.debug('user disconnected');
      });
    });

    logger.info('WebSocketServer is running');
  }
}

module.exports = WebSocketServer;
