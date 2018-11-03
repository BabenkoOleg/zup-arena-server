module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
    activeMatchId: {
      allowNull: true,
      type: DataTypes.UUID,
      references: {
        model: 'Matches',
        key: 'id',
      },
    },
  }, {});

  User.associate = (models) => {
    User.belongsToMany(models.Match, {
      as: 'matches',
      foreignKey: 'matchId',
      required: false,
      through: 'UserMatch',
      timestamps: false,
    });
  };

  return User;
};
