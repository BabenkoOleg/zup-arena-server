const loadVariables = require('./util/env');
const initDb = require('./db');
const logger = require('./util/logger');

const Lootbox = require('./models/Lootbox');

loadVariables();
initDb();

const lootboxes = [
  { steamId: 951, name: 'COLOR', price: 250 },
  { steamId: 952, name: 'FACE', price: 500 },
  { steamId: 953, name: 'HAT', price: 750 },
  { steamId: 954, name: 'ACCESSORY', price: 500 },
  { steamId: 955, name: 'EMOTION', price: 250 },
  { steamId: 960, name: 'RARE', price: 5000 },
];

lootboxes.forEach(async (lootbox) => {
  const query = { name: lootbox.name };
  const update = { price: lootbox.price, steamId: lootbox.steamId };
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };

  try {
    await Lootbox.findOneAndUpdate(query, update, options);
  } catch (error) {
    logger.error(error.message);
  }
});
