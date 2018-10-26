const { User } = require('../models/index');

class Router {
  constructor(server) {
    this.server = server;
  }

  loadRoutes() {
    this.server.get('/', (req, res) => {
      User.count().then((c) => {
        res.json({
          message: `There are ${c} users!`,
        });
      });
    });
  }
}

module.exports = Router;
