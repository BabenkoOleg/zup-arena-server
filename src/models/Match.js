const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  team: { type: Boolean, default: false },
  finished: { type: Boolean, default: false },
  finishedAt: { type: Date },
  users: [{
    steamId: String,
    alive: { type: Boolean, default: true },
    team: { type: Number, default: 0 },
  }],
  kills: [{
    steamId: String,
    target: String,
  }],
  deaths: [{
    steamId: String,
    killer: String,
  }],
});

schema.statics.createFromUsersList = function createFromUsersList(usersList, cb) {
  const users = [];
  let team = false;

  if (Array.isArray(usersList[0])) {
    team = true;
    usersList.forEach((list, index) => list.forEach((steamId) => {
      users.push({ steamId, team: index });
    }));
  } else {
    usersList.forEach(steamId => users.push({ steamId }));
  }

  return this.create({ team, users }, cb);
};

schema.methods.kill = function kill(currentUser, steamId, cb) {
  const target = this.users.find(user => user.steamId === steamId);

  if (!target) return cb('Target user not found');
  if (!target.alive) return cb('Target user already killed');

  target.alive = false;
  this.kills.push({ staemId: currentUser.steamId, target: target.steamId });

  return this.save(cb);
};

schema.methods.death = function kill(currentUser, steamId, cb) {
  const killer = this.users.find(user => user.steamId === steamId);

  if (!killer) return cb('Killer not found');

  this.deaths.push({ steamId: currentUser.steamId, killer: killer.steamId });

  return this.save(cb);
};

const Match = mongoose.model('Match', schema);

module.exports = Match;
