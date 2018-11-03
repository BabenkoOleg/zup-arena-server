module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('UserMatch', {
    userId: {
      allowNull: false,
      type: Sequelize.UUID,
      foreignKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    matchId: {
      allowNull: false,
      type: Sequelize.UUID,
      foreignKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
  }),
  down: queryInterface => queryInterface.dropTable('UserMatch'),
};
