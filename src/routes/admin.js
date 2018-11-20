const express = require('express');

const matchesController = require('../controllers/admin/matchesController');

const matchesRouter = express.Router();
matchesRouter.get('/', matchesController.index);
matchesRouter.get('/:id', matchesController.show);

module.exports = [
  {
    path: '/admin/matches',
    router: matchesRouter,
  },
];
