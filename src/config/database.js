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
    use_env_variable: 'DATABASE_URL',
  },
};
