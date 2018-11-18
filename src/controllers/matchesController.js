// const { User, Match, Sequelize } = require('../../db/models');
const Match = require('../models/Match');
const te = require('../util/throwErrorWithStatus');
const aes = require('../util/aes');

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

module.exports.create = async (request, response) => {
  try {
    if (!request.body.users || !Array.isArray(request.body.users)) {
      te('Users list not provided', 422);
    }

    const usersList = request.body.users;
    const users = [];

    usersList.forEach((list, index) => {
      list.forEach(steamId => users.push({
        steamId,
        team: index,
        aes: {
          key: aes.randomAesKey(),
          iv: aes.randomAesIv(),
        },
      }));
    });

    const match = await Match.create({ users, rounds: [] });

    response.json({ id: match.id });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};

/**
 * @api {get} /api/matches/:id/credentials Request credentials
 * @apiName MatchCredentials
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
 * @apiSuccess {String} key 256-bit secret key
 * @apiSuccess {String} iv Vector (16-bytes)
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *     {
 *       "key": "42-DC-64-3A-DF-DE-B4-F0-7A-78...",
 *       "iv": "B0-7B-39-FC-6B-72-9E-5E-17-93..."
 *     }
 */

module.exports.credentials = async (request, response) => {
  const { currentUser } = request;

  try {
    const match = await Match.findById(request.params.id);
    if (!match) te(`Match with id ${request.params.id} not found`, 404);

    const user = match.users.find(u => u.steamId === currentUser.steamId);
    if (!user) te(`User with steamId ${currentUser.steamId} not found in this match`, 404);

    response.json({
      key: aes.hexWithDashes(user.aes.key),
      iv: aes.hexWithDashes(user.aes.iv),
    });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};

/**
 * @api {post} /api/matches/:id/round Report the new round
 * @apiName NextRound
 * @apiDescription Report the end of the current round and the beginning of a new one.
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
 * @apiParam {Boolean} timeIsUp Expired match time. If there is no parameter in the request,
 *                     the default value is false
 * @apiParam {Boolean} finish The final round of the match. If there is no parameter in the request,
 *                     the default value is false
 * @apiParam {Array} reports List of encrypted users reports. Format - steamId#encrypdet-data.
 *                           The encrypted part must contain a JSON data array as
 *                           Encrypted-Part-Example
 *
 * @apiParamExample {json} Request-Example
 *   {
 *     "timeIsUp": false,
 *     "finish": false,
 *     "reports": [
 *       "00000000000000000#ab331ab864150a92a5cd6846c4...",
 *       "00000000000000001#c96d21ab612d524853516d16ac...",
 *       "00000000000000002#81f5a0b7a081329af13873d4af...",
 *       "00000000000000003#a73d675e0588162ccd45d815bb..."
 *     ]
 *   }
 *
 * @apiParamExample {json} Encrypted-Part-Example
 *   [
 *     {
 *       "killer": "00000000000000001",
 *       "target": "00000000000000000"
 *     },
 *     {
 *       "killer": "00000000000000003",
 *       "target": "00000000000000001"
 *     }
 *  ]
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 */

module.exports.round = async (request, response) => {
  try {
    const match = await Match.findById(request.params.id);

    const { reports } = request.body;
    const timeIsUp = request.body.timeIsUp || false;
    const finish = request.body.finish || false;

    await match.addRound(reports, timeIsUp);

    if (finish) await match.finish();

    response.status(200).json({});
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};

module.exports.show = async (request, response) => {
  try {
    const match = await Match.findById(request.params.id);
    if (!match) te(`Match with id ${request.params.id} not found`, 404);
    response.status(200).json(match);
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};
