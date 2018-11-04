const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  steamId: String,
  level: { type: Number, default: 0 },
  money: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  availableNewLootboxes: { type: Number, default: 0 },
  activeMatch: { type: Schema.Types.ObjectId, ref: 'Match' },
});

const User = mongoose.model('User', schema);

module.exports = User;
