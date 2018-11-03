const Sequelize = require('sequelize');
require('../util/env').loadVariables();

module.exports = {
  development: {
    database: 'zup-arena_development',
    username: null,
    password: null,
    dialect: 'postgres',
    operatorsAliases: Sequelize.Op,
  },
  production: {
    database: process.env.POSTGRES_DATABASE,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    dialect: 'postgres',
    operatorsAliases: Sequelize.Op,
  },
};
