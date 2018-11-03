const uuidv4 = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Match = sequelize.define('Match', {
    uuid: { type: DataTypes.STRING },
    state: { type: DataTypes.ENUM('pending', 'active', 'finished'), defaultValue: 'pending' },
    startedAt: { type: DataTypes.DATE },
    finishedAt: { type: DataTypes.DATE },
  }, {});

  Match.beforeCreate((match) => {
    match.uuid = `m-${uuidv4()}`;
  });

  return Match;
};
