const express = require('express');

const authorizationController = require('./controllers/authorization');
const profileController = require('./controllers/profile');
const matchesController = require('./controllers/matches');
const lootboxesController = require('./controllers/lootboxes');

const authorizationRouter = express.Router();
authorizationRouter.post('/', authorizationController.create);
authorizationRouter.get('/test-user/:id', authorizationController.testUser);

const profileRouter = express.Router();
profileRouter.get('/', profileController.show);

const matchesRouter = express.Router();
matchesRouter.post('/', matchesController.create);
matchesRouter.get('/:id', matchesController.show);
matchesRouter.get('/:id/credentials', matchesController.credentials);
matchesRouter.post('/:id/round', matchesController.round);
matchesRouter.post('/:id/leave', matchesController.leave);

const lootboxesRouter = express.Router();
lootboxesRouter.get('/', lootboxesController.index);
lootboxesRouter.post('/:id', lootboxesController.buy);

module.exports = [
  {
    path: '/auth',
    router: authorizationRouter,
  },
  {
    path: '/profile',
    router: profileRouter,
  },
  {
    path: '/matches',
    router: matchesRouter,
  },
  {
    path: '/lootboxes',
    router: lootboxesRouter,
  },
];
