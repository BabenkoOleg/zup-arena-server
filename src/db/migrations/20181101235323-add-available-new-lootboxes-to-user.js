module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'availableNewLootboxes', {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  }),
  down: queryInterface => queryInterface.removeColumn('Users', 'availableNewLootboxes'),
};
