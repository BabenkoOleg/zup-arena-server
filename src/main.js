const Env = require('./util/env');
const ApiServer = require('./api/ApiServer');
const WebSocketServer = require('./ws/WebSocketServer');
require('./db/models');

Env.loadVariables();

const api = new ApiServer();
api.run();

const ws = new WebSocketServer(api.server);
ws.run();
