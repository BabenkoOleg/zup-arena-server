module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    level: { type: DataTypes.INTEGER, defaultValue: 0 },
    money: { type: DataTypes.INTEGER, defaultValue: 0 },
    rank: { type: DataTypes.INTEGER, defaultValue: 0 },
    steamId: { type: DataTypes.STRING, unique: true },
    xp: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {});

  return User;
};
