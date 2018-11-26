const express = require('express');

const matchesController = require('../controllers/admin/matchesController');
const usersController = require('../controllers/admin/usersController');

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
