module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'activeMatchId', {
    allowNull: true,
    type: Sequelize.UUID,
    references: {
      model: 'Matches',
      key: 'id',
    },
  }),

  down: queryInterface => queryInterface.removeColumn('Users', 'activeMatchId'),
};
