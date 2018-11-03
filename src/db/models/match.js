const uuidv4 = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Match = sequelize.define('Match', {
    uuid: {
      type: DataTypes.STRING,
      unique: true,
    },
    state: {
      type: DataTypes.ENUM('pending', 'active', 'finished'),
      defaultValue: 'pending',
    },
    startedAt: {
      type: DataTypes.DATE,
    },
    finishedAt: {
      type: DataTypes.DATE,
    },
  }, {});

  Match.beforeCreate((match) => {
    match.uuid = uuidv4();
  });

  return Match;
};
