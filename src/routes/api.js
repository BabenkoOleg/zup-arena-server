const express = require('express');

const authController = require('../controllers/api/authController');
const profileController = require('../controllers/api/profileController');
const matchesController = require('../controllers/api/matchesController');
const lootboxesController = require('../controllers/api/lootboxesController');

const authRouter = express.Router();
authRouter.post('/', authController.create);
authRouter.get('/test-user/:id', authController.testUser);

const profileRouter = express.Router();
profileRouter.get('/', profileController.show);

const matchesRouter = express.Router();
matchesRouter.post('/', matchesController.create);
matchesRouter.get('/:id', matchesController.show);
matchesRouter.get('/:id/credentials', matchesController.credentials);
matchesRouter.post('/:id/round', matchesController.round);

const lootboxesRouter = express.Router();
lootboxesRouter.get('/', lootboxesController.index);
lootboxesRouter.post('/:id', lootboxesController.buy);

module.exports = [
  {
    path: '/auth',
    router: authRouter,
  }, {
    path: '/profile',
    router: profileRouter,
  }, {
    path: '/matches',
    router: matchesRouter,
  }, {
    path: '/lootboxes',
    router: lootboxesRouter,
  },
];
