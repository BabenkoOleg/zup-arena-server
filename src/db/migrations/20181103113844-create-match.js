module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Matches', {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    state: {
      type: Sequelize.ENUM,
      values: ['pending', 'active', 'finished'],
      defaultValue: 'pending',
    },
    startedAt: {
      type: Sequelize.DATE,
    },
    finishedAt: {
      type: Sequelize.DATE,
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
  down: queryInterface => queryInterface.dropTable('Matches'),
};
