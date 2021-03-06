const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  steamId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
  reward: { type: Boolean, default: true },
});

const Lootbox = mongoose.model('Lootbox', schema);

module.exports = Lootbox;
