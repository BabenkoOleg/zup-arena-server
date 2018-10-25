import * as http from 'http';
import * as WebSocket from 'ws';
import app from './app';
import logger from './util/logger';

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.send('Hi there, I am a WebSocket server');
});

server.listen(app.get('port'), () => {
  logger.info(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`);
});

export default server;
