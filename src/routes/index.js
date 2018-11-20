const apiRoutes = require('./api');
const adminRoutes = require('./admin');

module.exports = [
  ...apiRoutes,
  ...adminRoutes,
];
