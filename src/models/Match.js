const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  team: { type: Boolean, default: false },
  finished: { type: Boolean, default: false },
  finishedAt: { type: Date },
  users: [{
    steamId: String,
    team: Number,
  }],
  rounds: [{
    winningTeams: { type: Array, default: [] },
    kills: [{
      killer: String,
      target: String,
    }],
    deaths: [{
      killer: String,
      target: String,
    }],
  }],
  teams: [{
    users: [{
      steamId: String,
    }],
  }],
});

const Match = mongoose.model('Match', schema);

module.exports = Match;
