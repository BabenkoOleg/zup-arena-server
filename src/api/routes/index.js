const express = require('express');

const authController = require('../controllers/auth');
const profileController = require('../controllers/profile');


const authRouter = express.Router();
authRouter.post('/', authController.create);

const profileRouter = express.Router();
profileRouter.get('/', profileController.show);

module.exports = [
  {
    path: '/api/auth',
    router: authRouter,
  }, {
    path: '/api/profile',
    router: profileRouter,
  },
];
