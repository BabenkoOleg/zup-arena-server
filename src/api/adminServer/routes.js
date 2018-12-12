const express = require('express');

const apiLogsController = require('./controllers/apiLogs');
const authorizationController = require('./controllers/authorization');
const lootboxesController = require('./controllers/lootboxes');
const matchesController = require('./controllers/matches');
const usersController = require('./controllers/users');
const securityController = require('./controllers/security');

const apiLogsRouter = express.Router();
apiLogsRouter.get('/', apiLogsController.index);
apiLogsRouter.get('/:id', apiLogsController.show);

const authorizationRouter = express.Router();
authorizationRouter.post('/', authorizationController.create);

const lootboxesRouter = express.Router();
lootboxesRouter.get('/', lootboxesController.index);
lootboxesRouter.get('/new', lootboxesController.new);
lootboxesRouter.get('/:id', lootboxesController.show);
lootboxesRouter.get('/:id/edit', lootboxesController.edit);
lootboxesRouter.put('/:id', lootboxesController.update);
lootboxesRouter.post('/', lootboxesController.create);
lootboxesRouter.delete('/:id', lootboxesController.destroy);

const matchesRouter = express.Router();
matchesRouter.get('/', matchesController.index);
matchesRouter.get('/:id', matchesController.show);

const usersRouter = express.Router();
usersRouter.get('/', usersController.index);
usersRouter.get('/:id', usersController.show);
usersRouter.put('/:id', usersController.update);

const securityRouter = express.Router();
securityRouter.get('/', securityController.edit);
securityRouter.put('/', securityController.update);

module.exports = [
  {
    path: '/api-logs',
    router: apiLogsRouter,
  },
  {
    path: '/auth',
    router: authorizationRouter,
  },
  {
    path: '/lootboxes',
    router: lootboxesRouter,
  },
  {
    path: '/matches',
    router: matchesRouter,
  },
  {
    path: '/users',
    router: usersRouter,
  },
  {
    path: '/security',
    router: securityRouter,
  },
];
