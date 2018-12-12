const Base = require('./base');

class Security extends Base {
  serializeDocument(document) {
    return {
      login: document.login,
    };
  }
}

module.exports = Security;
