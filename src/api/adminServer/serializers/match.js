const Base = require('./base');

class Lootbox extends Base {
  serializeCollection(collection) {
    return collection.map(document => ({
      id: document.id,
      state: document.state,
      createdAt: document.createdAt,
    }));
  }

  serializeDocument(document, options) {
    const dataBaseUsers = options.users;

    return {
      id: document.id,
      state: document.state,
      createdAt: document.createdAt,
      users: this.serializeUsers(document.users, dataBaseUsers),
      rounds: this.serializeRounds(document.rounds, document.users, dataBaseUsers),
    };
  }

  serializeUsers(users, dataBaseUsers) {
    return users.map(user => ({
      steamId: user.steamId,
      steamName: this.getUserName(dataBaseUsers, user.steamId),
      team: user.team,
      isWinner: user.isWinner,
      frags: user.frags,
      deserter: user.deserter,
      awards: user.awards,
    }));
  }

  serializeRounds(rounds, matchUsers, dataBaseUsers) {
    return rounds.map((round, i) => ({
      number: (i + 1),
      winningTeams: round.winningTeams,
      timeIsUp: round.timeIsUp,
      kills: this.serializeKills(round.kills, matchUsers, dataBaseUsers),
    }));
  }

  serializeKills(kills, matchUsers, dataBaseUsers) {
    return kills.map(kill => ({
      killer: kill.killer,
      killerName: this.getUserName(dataBaseUsers, kill.killer),
      killerTeam: matchUsers.find(user => user.steamId === kill.killer).team,
      target: kill.target,
      targetName: this.getUserName(dataBaseUsers, kill.target),
      targetTeam: matchUsers.find(user => user.steamId === kill.target).team,
    }));
  }

  getUserName(users, steamId) {
    const user = users.find(u => u.steamId === steamId);
    return user ? user.steamName : null;
  }
}

module.exports = Lootbox;
