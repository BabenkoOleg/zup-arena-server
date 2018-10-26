const { User } = require('../models/index');

class Router {
  static loadRoutes(server) {
    server.get('/', (req, res) => {
      User.count().then((c) => {
        res.json({
          message: `There are ${c} users!`,
        });
      });
    });
  }
}

module.exports = Router;
