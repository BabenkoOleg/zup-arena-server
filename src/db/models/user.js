const uuidv4 = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    uuid: {
      type: DataTypes.STRING,
      unique: true,
    },
    steamId: {
      type: DataTypes.STRING,
      unique: true,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    money: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rank: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    xp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    availableNewLootboxes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {});

  User.beforeCreate((user) => {
    user.uuid = `u-${uuidv4()}`;
  });

  return User;
};
