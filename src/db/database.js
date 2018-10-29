const Sequelize = require('sequelize');

module.exports = {
  development: {
    database: 'zup-arena_development',
    username: null,
    password: null,
    dialect: 'postgres',
    operatorsAliases: Sequelize.Op,
  },
  production: {
    database: 'zup-arena_production',
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    dialect: 'postgres',
    operatorsAliases: Sequelize.Op,
  },
};
