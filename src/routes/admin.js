const express = require('express');

const matchesController = require('../controllers/admin/matchesController');

const matchesRouter = express.Router();
matchesRouter.get('/', matchesController.index);
matchesRouter.get('/test_steam_appid', matchesController.test_steam_appid);
matchesRouter.get('/:id', matchesController.show);

module.exports = [
  {
    path: '/admin/matches',
    router: matchesRouter,
  },
];
