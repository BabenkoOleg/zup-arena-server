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
 * @apiSuccess {String} id Unique user ID
 * @apiSuccess {String} steamId ID in the Steam system
 * @apiSuccess {Number} level Current level
 * @apiSuccess {Number} money Amount of game currency
 * @apiSuccess {Number} rank Current rank
 * @apiSuccess {Number} xp Amount of experience
 * @apiSuccess {Number} availableNewLootboxes Amount of available lootboxes
 * @apiSuccess {String} activeMatchId ID of current match or null
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "id": "5be1ea22eebdda6c47c3cdfe",
 *     "steamId": "12345678901234567",
 *     "level": 0,
 *     "money": 0,
 *     "rank": 0,
 *     "xp": 0,
 *     "availableNewLootboxes": 0,
 *     "activeMatchId": "5be1ea22eebdda6c47c3cdfd"
 *   }
 */

module.exports.show = (request, response) => {
  const { currentUser } = request;
  response.json({
    id: currentUser.id,
    steamId: currentUser.steamId,
    level: currentUser.level,
    money: currentUser.money,
    rank: currentUser.rank,
    xp: currentUser.xp,
    availableNewLootboxes: currentUser.availableNewLootboxes,
    activeMatchId: (currentUser.activeMatch ? currentUser.activeMatch.id : null),
  });
};
