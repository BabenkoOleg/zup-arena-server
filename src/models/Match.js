const mongoose = require('mongoose');
const User = require('./User');
const aes = require('../util/aes');

const { Schema } = mongoose;

const schema = new Schema({
  state: { type: String, default: 'active' },
  finishedAt: { type: Date, default: null },
  users: [{
    steamId: String,
    team: Number,
    isWinner: { type: Boolean, default: false },
    frags: { type: Number, default: 0 },
    aes: { key: String, iv: String },
    awards: {
      money: {
        type: Number,
        default: 0,
      },
      xp: {
        type: Number,
        default: 0,
      },
    },
  }],
  rounds: [{
    winningTeams: { type: Array, default: [] },
    kills: [{ killer: String, target: String }],
  }],
  winningTeams: { type: Array, default: [] },
}, {
  timestamps: true,
});

schema.methods.addRound = async function (usersReports, timeIsUp) {
  const reports = [];
  let kills = [];

  usersReports.forEach((row) => {
    const rowParts = row.split('#');
    const steamId = rowParts[0];
    const encrypted = rowParts[1];
    const user = this.users.find(u => u.steamId === steamId);
    const decrypted = aes.decrypt(encrypted, user.aes.key, user.aes.iv);

    reports.push({ user, kills: JSON.parse(decrypted) });
  });

  reports.forEach((report) => {
    report.kills.forEach((newKill) => {
      const killer = this.users.find(u => u.steamId === newKill.killer);
      const target = this.users.find(u => u.steamId === newKill.target);

      if (killer && target && killer.team !== target.team) {
        const kill = kills.find(k => k.killer === newKill.killer && k.target === newKill.target);

        if (kill) return kill.count += 1;

        kills.push({
          user: killer,
          killer: newKill.killer,
          target: newKill.target,
          count: 1,
        });
      }
    });
  });

  kills = kills.filter(k => (k.count / reports.length) > 0.5);
  kills.forEach(kill => (kill.user.frags += 1));
  kills = kills.map(k => ({ killer: k.killer, target: k.target }));

  const round = { kills };

  if (!timeIsUp) {
    const killed = kills.map(kill => kill.target);
    const winningTeams = this.users.filter(u => !killed.includes(u.steamId)).map(u => u.team);

    round.winningTeams = [...new Set(winningTeams)];
  }

  this.rounds.push(round);

  await this.save();
};

schema.methods.finish = async function () {
  this.state = 'finished';
  this.finishedAt = Date.now();

  this.winningTeams = [...new Set(this.rounds.map(round => round.winningTeams).flat())];

  this.users.forEach(async (matchUser) => {
    const isWinner = this.winningTeams.includes(matchUser.team);
    const money = (isWinner ? (200 / this.winningTeams.length) : 50) + matchUser.frags * 10;
    const xp = (isWinner ? (150 / this.winningTeams.length) : 50) + matchUser.frags * 10;

    matchUser.isWinner = isWinner;
    matchUser.awards = { money, xp };

    const user = await User.findOne({ steamId: matchUser.steamId });
    await user.addAwards(money, xp);
  });

  await this.save();
};

const Match = mongoose.model('Match', schema);

module.exports = Match;
