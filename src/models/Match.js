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

const Match = mongoose.model('Match', schema);

module.exports = Match;
