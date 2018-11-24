const Lootbox = require('../../models/Lootbox');
const te = require('../../util/throwErrorWithStatus');

/**
 * @api {get} /api/lootboxes Request Lootboxes list
 * @apiName GetLootboxes
 * @apiVersion 0.1.0
 * @apiGroup Lootbox
 *
 * @apiPermission Authorized users only
 * @apiHeader {String} Authorization Server-signed authentication token
 * @apiHeaderExample {json} Header-Example:
 *   {
 *     "Authorization": "Bearer xxx.zzz.yyy"
 *   }
 *
 * @apiSuccess {String} id Unique lootbox ID
 * @apiSuccess {String} steamId ID in the Steam system
 * @apiSuccess {String} name Name of lootbox
 * @apiSuccess {Number} price Price
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": "5bf58b2661dafb4f79142672",
 *         "steamId": "951",
 *         "name": "COLOR",
 *         "price": 250
 *       },
 *     ]
 */

module.exports.index = async (request, response) => {
  try {
    const lootboxes = await Lootbox.find({});
    const data = lootboxes.map(lootbox => ({
      id: lootbox.id,
      steamId: lootbox.steamId,
      name: lootbox.name,
      price: lootbox.price,
    }));

    response.json(data);
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};

/**
 * @api {post} /api/lootboxes/:steamId Request Buy lootbox
 * @apiName BuyLootbox
 * @apiVersion 0.1.0
 * @apiGroup Lootbox
 *
 * @apiPermission Authorized users only
 * @apiHeader {String} Authorization Server-signed authentication token
 * @apiHeaderExample {json} Header-Example:
 *   {
 *     "Authorization": "Bearer xxx.zzz.yyy"
 *   }
 *
 * @apiSuccess {String} itemid Unique item ID on Steam system
 * @apiSuccess {String} itemdefid Unique item definition ID on Steam system
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *     {
 *       "itemid": "1949392212715721368",
 *       "itemdefid": "953",
 *     }
 */

module.exports.buy = async (request, response) => {
  const { currentUser } = request;

  try {
    const lootbox = await Lootbox.findOne({ steamId: request.params.id });
    if (!lootbox) te(`Lootbox with steamId ${request.params.id} not found`, 404);

    if (lootbox.price > currentUser.money) te('Not enough money', 422);

    const steamResponse = await currentUser.addLootboxesInSteam([lootbox.steamId]);

    const steamLootbox = JSON.parse(steamResponse.response.item_json)[0];

    currentUser.money -= lootbox.price;
    await currentUser.save();

    response.json({
      itemid: steamLootbox.itemid,
      quantity: steamLootbox.quantity,
      itemdefid: steamLootbox.itemdefid,
      acquired: steamLootbox.acquired,
    });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};
