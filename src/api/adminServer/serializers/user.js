const Base = require('./base');

class User extends Base {
  serializeCollection(collection) {
    return collection.map(document => ({
      steamId: document.steamId,
      steamName: document.steamName,
      level: document.level,
      rank: document.rank,
      money: document.money,
      frags: document.frags.enemies,
      xp: document.xp,
      banned: document.banned,
      matches: document.matches.victories + document.matches.defeats,
    }));
  }

  serializeDocument(document) {
    const fragsTotal = document.frags.enemies + document.frags.teammates + document.frags.suicides;
    const matchesTotal = document.matches.victories + document.matches.defeats;
    const matchesWinningPercentage = document.matches.victories / matchesTotal * 100;

    return {
      steamId: document.steamId,
      steamName: document.steamName,
      steamAvatar: document.steamAvatar,
      steamCountryCode: document.steamCountryCode,
      banned: document.banned,
      money: document.money,
      xp: document.xp,
      level: document.level,
      rank: document.rank,
      frags: {
        total: fragsTotal,
        enemies: document.frags.enemies,
        teammates: document.frags.teammates,
        suicides: document.frags.suicides,
      },
      matches: {
        total: matchesTotal,
        victories: document.matches.victories,
        defeats: document.matches.defeats,
        winningPercentage: matchesWinningPercentage.toFixed(2),
      },
      desertions: document.desertions,
      activeMatch: document.activeMatch,
      lastLoginAt: document.lastLoginAt,
      lastActivityAt: document.lastActivityAt,
    };
  }
}

module.exports = User;
