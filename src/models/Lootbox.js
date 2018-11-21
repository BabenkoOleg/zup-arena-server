const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
});

const Lootbox = mongoose.model('Lootbox', schema);

module.exports = Lootbox;
