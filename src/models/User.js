const mongoose = require('mongoose');
const SteamService = require('../services/Steam');
const Lootbox = require('./Lootbox');
const { LEVELS_MAP, MAX_XP } = require('./LevelsMap');

const { Schema } = mongoose;

const schema = new Schema({
  steamId: String,
  money: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  rank: { type: Number, default: 1 },
  frags: { type: Number, default: 0 },
  matches: { type: Number, default: 0 },
  activeMatch: { type: Schema.Types.ObjectId, ref: 'Match' },
});

schema.methods.addMatchAwards = async function (money, xp, frags) {
  this.money += money;
  this.xp += xp;
  this.frags += frags;
  this.matches += 1;

  const normalizedXp = this.xp % MAX_XP;
  const newLevel = LEVELS_MAP.find(level => normalizedXp >= level.min && normalizedXp <= level.max);

  const lootboxSteamIds = [];

  if (this.level !== newLevel.number) {
    const lootboxes = await Lootbox.find({ reward: true });

    while (this.level !== newLevel.number) {
      this.level += 1;
      lootboxSteamIds.push(lootboxes[Math.floor(Math.random() * lootboxes.length)].steamId);
      if (this.level > 100) this.level -= 100;
      if (this.level % 5 === 0) {
        if (this.rank < 30) this.rank += 1;
      }
    }
  }

  try {
    if (this.steamId === '76561198338268835') {
      await this.addLootboxesInSteam(lootboxSteamIds);
    }
  } catch (error) {
    console.log(error);
  }

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
