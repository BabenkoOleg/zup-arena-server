const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  state: {
    type: String,
    default: 'active',
  },
  users: [{
    steamId: String,
    team: Number,
    frags: {
      type: Number,
      default: 0,
    },
    aesKey: String,
    aesIv: String,
  }],
  rounds: [{
    winningTeams: {
      type: Array,
      default: [],
    },
    kills: [{
      killer: String,
      target: String,
    }],
  }],
});

const Match = mongoose.model('Match', schema);

module.exports = Match;
