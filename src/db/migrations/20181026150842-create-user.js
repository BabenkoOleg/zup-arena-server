module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    uuid: {
      type: Sequelize.STRING,
      unique: true,
    },
    steamId: {
      type: Sequelize.STRING,
      unique: true,
    },
    level: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    money: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    rank: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    xp: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('Users'),
};
