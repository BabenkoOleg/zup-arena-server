const Env = require('./util/env');

Env.loadVariables();

const ApiServer = require('./api/ApiServer');
const WebSocketServer = require('./ws/WebSocketServer');

require('./db/models');

const api = new ApiServer();
api.run();

const ws = new WebSocketServer(api.server);
ws.run();
