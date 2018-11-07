/**
 * @api {get} /api/profile Request User information
 * @apiName GetProfile
 * @apiVersion 0.1.0
 * @apiGroup Profile
 *
 * @apiPermission Authorized users only
 * @apiHeader {String} Authorization Server-signed authentication token
 * @apiHeaderExample {json} Header-Example:
 *   {
 *     "Authorization": "Bearer xxx.zzz.yyy"
 *   }
 *
 * @apiSuccess {Boolean} success Successful execution of the request
 * @apiSuccess {Object} data User information
 * @apiSuccess {String} data.id Unique user ID
 * @apiSuccess {String} data.steamId ID in the Steam system
 * @apiSuccess {Number} data.level Current level
 * @apiSuccess {Number} data.money Amount of game currency
 * @apiSuccess {Number} data.rank Current rank
 * @apiSuccess {Number} data.xp Amount of experience
 * @apiSuccess {Number} data.availableNewLootboxes Amount of available lootboxes
 * @apiSuccess {String} data.activeMatchId ID of current match or null
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "success": true,
 *     "data": {
 *        "id": "93df2547-e8b8-46fa-83ef-51dd799f87e5",
 *        "steamId": "12345678901234567",
 *        "level": 0,
 *        "money": 0,
 *        "rank": 0,
 *        "xp": 0,
 *        "availableNewLootboxes": 0
 *     }
 *   }
 */

module.exports.show = (request, response) => {
  const { currentUser } = request;
  response.json({
    success: true,
    data: {
      id: currentUser.id,
      steamId: currentUser.steamId,
      level: currentUser.level,
      money: currentUser.money,
      rank: currentUser.rank,
      xp: currentUser.xp,
      availableNewLootboxes: currentUser.availableNewLootboxes,
      activeMatchId: (currentUser.activeMatch ? currentUser.activeMatch.id : null),
    },
  });
};
