const WebSocket = require('ws');
const logger = require('../util/logger');

class WebSocketServer extends WebSocket.Server {
  constructor(server) {
    super({ server });
  }

  run() {
    this.on('connection', (ws) => {
      ws.send('Hi there, I am a WebSocket server');
    });

    logger.info('WebSocketServer is running');
  }
}

module.exports = WebSocketServer;
