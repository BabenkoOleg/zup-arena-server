const mongoose = require('mongoose');
const SteamService = require('../services/Steam');
const Lootbox = require('./Lootbox');
const { LEVELS_MAP, MAX_XP } = require('./LevelsMap');

const { Schema } = mongoose;

const schema = new Schema({
  steamId: String,
  banned: { type: Boolean, default: false },
  money: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  rank: { type: Number, default: 1 },
  frags: {
    approved: { type: Number, default: 0 },
    forfeits: { type: Number, default: 0 },
    suicides: { type: Number, default: 0 },
  },
  matches: { type: Number, default: 0 },
  activeMatch: { type: Schema.Types.ObjectId, ref: 'Match' },
});

schema.methods.addMatchAwards = async function (money, xp, frags) {
  this.money += Math.floor(money);
  this.xp += Math.floor(xp);

  this.frags.approved += frags.approved;
  this.frags.forfeits += frags.forfeits;
  this.frags.suicides += frags.suicides;

  this.matches += 1;

  const normalizedXp = this.xp % MAX_XP;
  const newLevel = LEVELS_MAP.find(level => normalizedXp >= level.min && normalizedXp <= level.max);

  const lootboxSteamIds = [];

  if (this.level !== newLevel.number) {
    const lootboxes = await Lootbox.find({ reward: true });

    while (this.level !== newLevel.number) {
      this.level += 1;
      if (this.level > 100) this.level -= 100;
      if (this.level % 10 === 0) {
        lootboxSteamIds.push(lootboxes[Math.floor(Math.random() * lootboxes.length)].steamId);
      }
      if (this.level % 5 === 0 && this.rank < 30) this.rank += 1;
    }
  }

  try {
    await this.addLootboxesInSteam(lootboxSteamIds);
  } catch (error) { }

  await this.save();
};

schema.methods.addLootboxesInSteam = async function (lootboxSteamIds) {
  const itemdefids = {};
  lootboxSteamIds.forEach((id, index) => itemdefids[`itemdefid[${index}]`] = id);
  const steamResponse = await SteamService.post('IInventoryService', 'AddItem', {
    appid: process.env.STEAM_APP_ID,
    steamid: this.steamId,
    notify: 1,
    ...itemdefids,
  });

  return steamResponse;
};

const User = mongoose.model('User', schema);

module.exports = User;
