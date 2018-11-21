const Lootbox = require('../../models/Lootbox');
const te = require('../../util/throwErrorWithStatus');

/**
 * @api {post} /api/matches Request create Match
 * @apiName CreateMatch
 * @apiVersion 0.1.0
 * @apiGroup Match
 *
 * @apiPermission Authorized users only
 * @apiHeader {String} Authorization Server-signed authentication token
 * @apiHeaderExample {json} Header-Example:
 *   {
 *     "Authorization": "Bearer xxx.zzz.yyy"
 *   }
 *
 * @apiParam {Array} users List of user's steamIds or Array of lists of user's steamIds
 *
 * @apiParamExample {json} Request-Example
 *   {
 *     "users": [["12345678901234567"], ["12345678901234568"]]
 *   }
 *
 * @apiSuccess {String} id Unique match ID
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *     {
 *       "id": "5bde329b36dea19ab15d6ddb"
 *     }
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
