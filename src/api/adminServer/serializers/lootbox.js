const Base = require('./base');

class Lootbox extends Base {
  serializeCollection(collection) {
    return collection.map(document => this.serializeDocument(document));
  }

  serializeDocument(document) {
    return {
      id: document.id,
      steamId: document.steamId,
      name: document.name,
      price: document.price,
      reward: document.reward,
    };
  }
}

module.exports = Lootbox;
