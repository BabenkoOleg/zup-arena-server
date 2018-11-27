const loadVariables = require('./util/env');
const initDb = require('./db');
const logger = require('./util/logger');

const Lootbox = require('./models/Lootbox');

loadVariables();
initDb();

const seedLootboxes = async () => {
  const lootboxes = [
    { steamId: 951, reward: true, name: 'COLOR', price: 250 },
    { steamId: 952, reward: true, name: 'FACE', price: 500 },
    { steamId: 953, reward: true, name: 'HAT', price: 750 },
    { steamId: 954, reward: true, name: 'ACCESSORY', price: 500 },
    { steamId: 955, reward: true, name: 'EMOTION', price: 250 },
    { steamId: 960, reward: false, name: 'RARE', price: 5000 },
  ];

  lootboxes.forEach(async (lootbox) => {
    const query = { name: lootbox.name };
    const update = { price: lootbox.price, steamId: lootbox.steamId, reward: lootbox.reward };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    try {
      await Lootbox.findOneAndUpdate(query, update, options);
    } catch (error) {
      logger.error(error.message);
    }
  });
};

const run = async () => {
  await seedLootboxes();
};

run();
