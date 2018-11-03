const express = require('express');

const authController = require('../controllers/auth');
const profileController = require('../controllers/profile');
const matchesController = require('../controllers/matches');

const authRouter = express.Router();
authRouter.post('/', authController.create);

if (process.env.NODE_ENV === 'development') {
  authRouter.get('/test-user', authController.testUser);
}

const profileRouter = express.Router();
profileRouter.get('/', profileController.show);

const matchesRouter = express.Router();
matchesRouter.post('/', matchesController.create);

module.exports = [
  {
    path: '/api/auth',
    router: authRouter,
  }, {
    path: '/api/profile',
    router: profileRouter,
  }, {
    path: '/api/matches',
    router: matchesRouter,
  },
];
