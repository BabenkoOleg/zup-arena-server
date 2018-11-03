const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const logger = require('../../util/logger');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

const config = require(`${__dirname}/../database.js`)[env];
config.logging = message => logger.info(message);

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    logger.debug(`${model.name} model is imported`);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) db[modelName].associate(db);
});

sequelize.authenticate()
  .then(() => {
    logger.info('PostgreSQL connection established');

    if (process.env.NODE_ENV !== 'production') {
      db.User
        .findOrCreate({ where: { steamId: '00000000000000000' } })
        .spread((record) => {
          logger.error(`Test user with uuid ${record.uuid} updated`);
        });
    }
  })
  .catch(error => logger.error('Unable to connect to the database: ', error));

db.sequelize = sequelize;

module.exports = db;
