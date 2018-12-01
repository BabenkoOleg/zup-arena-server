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
    left: { type: Boolean, default: false },
    isWinner: { type: Boolean, default: false },
    frags: { type: Number, default: 0 },
    aes: { key: String, iv: String },
    awards: {
      money: { type: Number, default: 0 },
      xp: { type: Number, default: 0 },
    },
  }],
  rounds: [{
    winningTeams: { type: Array, default: [] },
    timeIsUp: { type: Boolean, default: false },
    kills: [{ killer: String, target: String }],
  }],
  winningTeams: { type: Array, default: [] },
}, {
  timestamps: true,
});

schema.methods.addRound = async function (request, usersReports, timeIsUp) {
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

  request.body.decryptedReports = reports.map(r => ({ user: r.user.steamId, kills: r.kills }));

  reports.forEach((report) => {
    report.kills.forEach((newKill) => {
      const killer = this.users.find(u => u.steamId === newKill.killer);
      const target = this.users.find(u => u.steamId === newKill.target);

      if (killer && target) {
        const isFrag = killer.steamId !== target.steamId && killer.team !== target.team;
        const kill = kills.find(k => k.killer === newKill.killer && k.target === newKill.target);

        if (kill) return kill.count += 1;

        kills.push({
          user: killer,
          killer: newKill.killer,
          target: newKill.target,
          isFrag,
          count: 1,
        });
      }
    });
  });

  kills = kills.filter(k => (k.count / reports.length) > 0.5);
  kills.forEach(kill => {
    if (kill.isFrag) kill.user.frags += 1;
  });
  kills = kills.map(k => ({ killer: k.killer, target: k.target }));

  const round = { kills, timeIsUp };

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

  const wins = this.rounds.map(round => round.winningTeams).flat();
  const winsByTeam = wins.reduce((acc, val) => acc.set(val, acc.get(val) + 1 || 1), new Map());
  const maxWinsCount = Math.max(...winsByTeam.values());
  this.winningTeams = [...winsByTeam.keys()].filter(key => winsByTeam.get(key) === maxWinsCount);

  this.users.forEach(async (mUser) => {
    const isWinner = this.winningTeams.includes(mUser.team);

    mUser.isWinner = isWinner;

    if (!mUser.left) {
      mUser.awards.money = (isWinner ? (200 / this.winningTeams.length) : 50) + mUser.frags * 10;
      mUser.awards.xp = (isWinner ? (150 / this.winningTeams.length) : 50) + mUser.frags * 10;

      const user = await User.findOne({ steamId: mUser.steamId });
      await user.addMatchAwards(mUser.awards.money, mUser.awards.xp, mUser.frags);
    }
  });

  await this.save();
};

const Match = mongoose.model('Match', schema);

module.exports = Match;
