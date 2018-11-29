const express = require('express');

const authorizationController = require('./controllers/authorization');
const matchesController = require('./controllers/matches');
const usersController = require('./controllers/users');

const authorizationRouter = express.Router();
authorizationRouter.post('/', authorizationController.create);

const matchesRouter = express.Router();
matchesRouter.get('/', matchesController.index);
matchesRouter.get('/:id', matchesController.show);

const usersRouter = express.Router();
usersRouter.get('/', usersController.index);
usersRouter.get('/:id', usersController.show);

module.exports = [
  {
    path: '/auth',
    router: authorizationRouter,
  },
  {
    path: '/matches',
    router: matchesRouter,
  },
  {
    path: '/users',
    router: usersRouter,
  },
];
