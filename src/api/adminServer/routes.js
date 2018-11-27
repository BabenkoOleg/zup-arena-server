const express = require('express');

const matchesController = require('./controllers/matches');
const usersController = require('./controllers/users');

const matchesRouter = express.Router();
matchesRouter.get('/', matchesController.index);
matchesRouter.get('/:id', matchesController.show);

const usersRouter = express.Router();
usersRouter.get('/', usersController.index);
usersRouter.get('/:id', usersController.show);

module.exports = [
  {
    path: '/admin/matches',
    router: matchesRouter,
  },
  {
    path: '/admin/users',
    router: usersRouter,
  },
];
