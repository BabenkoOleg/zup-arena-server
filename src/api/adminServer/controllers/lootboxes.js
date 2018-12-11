const Lootbox = require('../../../models/Lootbox');
const LootboxSerializer = require('../serializers/lootbox');

module.exports.index = async (request, response) => {
  const lootboxes = await Lootbox.find({}).sort('steamId');
  const data = new LootboxSerializer(lootboxes).asJson();

  response.json({ data });
};
