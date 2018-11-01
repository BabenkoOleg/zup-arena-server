const express = require('express');

const authController = require('../controllers/auth');

const authRouter = express.Router();
authRouter.post('/', authController.create);

module.exports = [
  {
    path: '/api/auth',
    router: authRouter,
  },
];
