const mongoose = require('mongoose');

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

const User = mongoose.model('User', schema);

module.exports = User;
