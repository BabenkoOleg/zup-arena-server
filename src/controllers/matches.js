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

    usersList.forEach((l, i) => l.forEach(steamId => users.push({ steamId, team: i })));

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

    if (!user.aesKey || !user.aesIv) {
      user.aesKey = aes.randomAesKey();
      user.aesIv = aes.randomAesIv();

      await match.save();
    }

    response.json({
      key: aes.hexWithDashes(user.aesKey),
      iv: aes.hexWithDashes(user.aesIv),
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
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 */

module.exports.round = async (request, response) => {
  try {
    const match = await Match.findById(request.params.id);

    const reports = [];
    let kills = [];

    request.body.kills.forEach((row) => {
      const rowParts = row.split('#');
      const steamId = rowParts[0];
      const encrypted = rowParts[1];
      const user = match.users.find(u => u.steamId === steamId);
      const decrypted = aes.decrypt(encrypted, user.aesKey, user.aesIv);

      reports.push({
        user,
        kills: JSON.parse(decrypted),
      });
    });

    reports.forEach((report) => {
      report.kills.forEach((newKill) => {
        const killer = match.users.find(u => u.steamId === newKill.killer);
        const target = match.users.find(u => u.steamId === newKill.target);

        if (killer && target && killer.team !== target.team) {
          const kill = kills.find(k => k.killer === newKill.killer && k.target === newKill.target);

          if (kill) return kill.count += 1;

          kills.push({
            user: killer,
            killer: newKill.killer,
            target: newKill.target,
            count: 1,
          });
        }
      });
    });

    kills = kills.filter(k => (k.count / reports.length) > 0.5);
    kills.forEach(kill => (kill.user.frags += 1));
    kills = kills.map(k => ({ killer: k.killer, target: k.target }));

    match.rounds.push({ kills });

    await match.save();

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
