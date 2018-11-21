const Lootbox = require('../../models/Lootbox');
const te = require('../../util/throwErrorWithStatus');

/**
 * @api {post} /api/lootboxes Request Lootboxes list
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
 * @apiSuccess {String} id Unique match ID
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
