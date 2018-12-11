const Lootbox = require('../../../models/Lootbox');
const LootboxSerializer = require('../serializers/lootbox');
const te = require('../../../util/throwErrorWithStatus');

module.exports.index = async (request, response) => {
  const lootboxes = await Lootbox.find({}).sort('steamId');
  const data = new LootboxSerializer(lootboxes).asJson();

  response.json({ data });
};

module.exports.show = async (request, response) => {
  try {
    const lootbox = await Lootbox.findById(request.params.id);
    if (!lootbox) te(`Lootbox with id ${request.params.id} not found`, 404);

    const data = new LootboxSerializer(lootbox).asJson();

    response.json({ data });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};

module.exports.new = async (request, response) => {
  try {
    const lootbox = new Lootbox();

    const data = new LootboxSerializer(lootbox).asJson();

    response.json({ data });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};

module.exports.create = async (request, response) => {
  try {
    const lootbox = await Lootbox.create(request.body);

    const data = new LootboxSerializer(lootbox).asJson();

    response.json({ data });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};

module.exports.edit = async (request, response) => {
  try {
    const lootbox = await Lootbox.findById(request.params.id);
    if (!lootbox) te(`Lootbox with id ${request.params.id} not found`, 404);

    const data = new LootboxSerializer(lootbox).asJson();

    response.json({ data });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};

module.exports.update = async (request, response) => {
  try {
    let lootbox = await Lootbox.findById(request.params.id);
    if (!lootbox) te(`Lootbox with id ${request.params.id} not found`, 404);

    lootbox = await lootbox.update({ $set: request.body });

    const data = new LootboxSerializer(lootbox).asJson();

    response.json({ data });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};

module.exports.destroy = async (request, response) => {
  try {
    const lootbox = await Lootbox.findById(request.params.id);
    if (!lootbox) te(`Lootbox with id ${request.params.id} not found`, 404);

    await lootbox.remove();

    response.json({});
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};
