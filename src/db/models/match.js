module.exports = (sequelize, DataTypes) => {
  const Match = sequelize.define('Match', {
    id: {
      allowNull: false,
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    state: {
      type: DataTypes.ENUM('active', 'finished'),
      defaultValue: 'active',
    },
    finishedAt: {
      type: DataTypes.DATE,
    },
  }, {});

  Match.associate = (models) => {
    Match.belongsToMany(models.User, {
      as: 'users',
      foreignKey: 'userId',
      required: false,
      through: 'UserMatch',
      timestamps: false,
    });

    Match.belongsTo(models.User, {
      foreignKey: 'createdBy',
    });
  };

  return Match;
};
