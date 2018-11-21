const mongoose = require('mongoose');
const SteamService = require('../services/Steam');

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

schema.methods.addAwards = async function (money, xp, frags) {
  this.money += money;
  this.xp += xp;
  this.frags += frags;
  this.matches += 1;

  await this.save();
};

schema.methods.addLootboxInSteam = async function (lootboxSteamId) {
  const steamResponse = await SteamService.post('IInventoryService', 'AddItem', {
    appid: process.env.STEAM_APP_ID,
    steamid: this.steamId,
    notify: 1,
    'itemdefid[0]': lootboxSteamId,
  });

  return steamResponse;
};

const User = mongoose.model('User', schema);

module.exports = User;
