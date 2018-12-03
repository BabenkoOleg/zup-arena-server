const mongoose = require('mongoose');
const User = require('./User');
const aes = require('../util/aes');

const { Schema } = mongoose;

const schema = new Schema({
  state: { type: String, default: 'active' },
  finishedAt: { type: Date, default: null },
  users: [{
    steamId: String,
    team: String,
    left: { type: Boolean, default: false },
    isWinner: { type: Boolean, default: false },
    frags: {
      approved: { type: Number, default: 0 },
      forfeits: { type: Number, default: 0 },
      suicides: { type: Number, default: 0 },
    },
    aes: {
      key: String,
      iv: String,
    },
    awards: {
      money: {
        total: { type: Number, default: 0 },
        victory: { type: Number, default: 0 },
        defeat: { type: Number, default: 0 },
        frags: { type: Number, default: 0 },
      },
      xp: {
        total: { type: Number, default: 0 },
        victory: { type: Number, default: 0 },
        defeat: { type: Number, default: 0 },
        frags: { type: Number, default: 0 },
      },
    },
  }],
  rounds: [{
    winningTeams: { type: Array, default: [] },
    timeIsUp: { type: Boolean, default: false },
    kills: [{
      killer: String,
      target: String,
    }],
  }],
  winningTeams: { type: Array, default: [] },
}, {
  timestamps: true,
});

schema.methods.addRound = async function (request, usersReports, timeIsUp) {
  const reports = [];
  let kills = [];

  request.body.decryptedReports = [];

  usersReports.forEach((row) => {
    const rowParts = row.split('#');
    const steamId = rowParts[0];
    const encrypted = rowParts[1];
    const user = this.users.find(u => u.steamId === steamId);
    const decrypted = aes.decrypt(encrypted, user.aes.key, user.aes.iv);

    request.body.decryptedReports.push({ user: user.steamId, report: decrypted });

    reports.push({ user, kills: JSON.parse(decrypted) });
  });

  request.body.parsedReports = reports.map(r => ({ user: r.user.steamId, kills: r.kills }));

  reports.forEach((report) => {
    report.kills.forEach((newKill) => {
      const uid = `${newKill.killer}#${newKill.target}`;
      const kill = kills.find(k => k.uid === uid);

      if (kill) return kill.confirmations += 1;

      const killer = this.users.find(u => u.steamId === newKill.killer);
      const target = this.users.find(u => u.steamId === newKill.target);

      let kind = 'approved';
      if (killer.team === target.team) kind = 'forfeits';
      if (killer.steamId === target.steamId) kind = 'suicides';

      kills.push({
        uid,
        user: killer,
        killer: newKill.killer,
        target: newKill.target,
        kind,
        confirmations: 1,
      });
    });
  });

  kills = kills.filter(k => (k.confirmations / reports.length) > 0.5);
  kills.forEach(kill => kill.user.frags[kill.kind] += 1);

  const round = { kills: kills.map(k => ({ killer: k.killer, target: k.target })), timeIsUp };

  if (!timeIsUp) {
    const killed = kills.map(kill => kill.target);
    const winningTeams = this.users
      .filter(user => !killed.includes(user.steamId) && !user.left)
      .map(user => user.team);

    round.winningTeams = [...new Set(winningTeams)];
  }

  this.rounds.push(round);

  await this.save();
};

schema.methods.finish = async function () {
  this.state = 'finished';
  this.finishedAt = Date.now();

  const allWins = this.rounds.map(round => round.winningTeams).flat();
  const awardedTeams = allWins
    .filter(i => this.users.filter(u => u.team === i && u.left === false).length > 0);

  const winsByTeam = awardedTeams
    .reduce((acc, val) => acc.set(val, acc.get(val) + 1 || 1), new Map());

  const maxWinsCount = Math.max(...winsByTeam.values());
  this.winningTeams = [...winsByTeam.keys()].filter(key => winsByTeam.get(key) === maxWinsCount);

  this.users.forEach(async (mUser) => {
    const isWinner = this.winningTeams.includes(mUser.team);

    mUser.isWinner = isWinner;

    if (!mUser.left) {
      let frags = mUser.frags.approved - mUser.frags.forfeits;
      if (frags < 0) frags = 0;

      const { money, xp } = mUser.awards;

      money.victory = isWinner ? (200 / this.winningTeams.length) : 0;
      money.defeat = isWinner ? 0 : 50;
      money.frags = frags * 10;
      money.total = money.victory + money.defeat + money.frags;

      xp.victory = isWinner ? (150 / this.winningTeams.length) : 0;
      xp.defeat = isWinner ? 0 : 50;
      xp.frags = frags * 10;
      xp.total = xp.victory + xp.defeat + xp.frags;

      const user = await User.findOne({ steamId: mUser.steamId });
      await user.addMatchAwards(mUser.awards.money.total, mUser.awards.xp.total, mUser.frags);
    }
  });

  await this.save();
};

const Match = mongoose.model('Match', schema);

module.exports = Match;
