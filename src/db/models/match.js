module.exports = (sequelize, DataTypes) => {
  const Match = sequelize.define('Match', {
    id: {
      allowNull: false,
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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

  Match.associate = (models) => {
    Match.belongsToMany(models.User, {
      foreignKey: 'userId',
      through: 'UserMatch',
      timestamps: false,
    });
  };

  return Match;
};
