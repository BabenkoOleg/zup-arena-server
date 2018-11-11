// const { User, Match, Sequelize } = require('../../db/models');
const mongoose = require('mongoose');
const Match = require('../models/Match');
const te = require('../util/throwErrorWithStatus');

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
 * @apiParam {Boolean} team Team or solo match
 * @apiParam {Array} users List of user's steamIds or Array of lists of user's steamIds
 *
 * @apiParamExample {json} Request-Example
 *   {
 *     "team": true,
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

    const userSteamIdList = request.body.users;
    const isTeamMatch = request.body.team || true;

    const users = [];
    const teams = [];

    userSteamIdList.forEach((list, index) => {
      const team = { users: [] };

      list.forEach((steamId) => {
        const user = ({ steamId, team: index });
        team.users.push(user);
        users.push(user);
      });

      teams.push(team);
    });

    const match = await Match.create({
      team: isTeamMatch,
      teams,
      users,
      rounds: [{}],
    });

    response.json({ id: match.id });
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
    if (!match) te(`Match with id ${request.params.id} not found`, 404);

    const round = match.rounds[match.rounds.length - 1];

    let users = match.users.slice();

    round.kills.forEach((k) => {
      if (round.deaths.find(d => d.killer === k.killer && d.target === k.target)) {
        users = users.filter(u => u.steamId !== k.target);
      }
    });

    round.winningTeams = [...new Set(users.map(u => u.team))];

    match.rounds.push({});

    await match.save();
    response.status(200).json({});
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};

/**
 * @api {post} /api/matches/:id/finish Request finish Match
 * @apiName FinishMatch
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
 * @apiSuccess {Boolean} success Successful execution of the request
 * @apiSuccess {Object} data Match information
 * @apiSuccess {String} data.id Unique match ID
 * @apiSuccess {Number} data.state State of match
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *     {
 *        "success": true,
 *        "data": {
 *            "id": "5bde2fe8191c439993275761",
 *            "state": "finished"
 *        }
 *    }
 */

module.exports.finish = (request, response) => {
  const query = { _id: mongoose.Types.ObjectId(request.params.id) };
  const update = { finished: true };
  const options = { new: true };

  Match.findOneAndUpdate(query, update, options, (error, record) => {
    if (error || !record) {
      response.status(422);
      response.json({
        success: false,
        error: `Match with id ${request.params.id} not found`,
      });
    } else {
      response.json({
        success: true,
        data: {
          id: record.id,
          finished: record.finished,
        },
      });
    }
  });
};

/**
 * @api {post} /api/matches/:id/kill Report the kill
 * @apiName KillUser
 * @apiDescription Report that the current user has killed another user
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
 * @apiParam {String} target Killed user steamId
 *
 * @apiParamExample {json} Request-Example:
 *   {
 *     "target": "12345678901234567"
 *   }
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 */

module.exports.kill = async (request, response) => {
  const { currentUser } = request;

  try {
    const match = await Match.findById(request.params.id);
    if (!match) te(`Match with id ${request.params.id} not found`, 404);
    if (!request.body.target) te('Target not provided', 422);

    const { target } = request.body;
    if (!match.users.find(u => u.steamId === target)) {
      te(`User with id ${target} is not registered in this match`, 422);
    }

    const round = match.rounds[match.rounds.length - 1];
    const kill = round.kills.find(k => k.target === target);

    if (kill) te(`User with id ${target} is already killed`, 422);

    round.kills.push({ killer: currentUser.steamId, target });

    await match.save();
    response.status(200).json({});
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};

/**
 * @api {post} /api/matches/:id/death Report the death
 * @apiName DeathUser
 * @apiDescription Report that the current user has been killed by another user
 * @apiVersion 0.1.0
 * @apiGroup Match
 *
 * @apiPermission Authorized users only
 * @apiHeader {String} Authorization Server-signed authentication token
 * @apiHeaderExample {json} Header-Example:
 *   {
 *     "Authorization": "Bearer xxx.zzz.yyy"
 *   }

 * @apiParam {String} killer Killer user steamId
 *
 * @apiParamExample {json} Request-Example:
 *   {
 *     "killer": "12345678901234567"
 *   }
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 */

module.exports.death = async (request, response) => {
  const { currentUser } = request;

  try {
    const match = await Match.findById(request.params.id);
    if (!match) te(`Match with id ${request.params.id} not found`, 404);
    if (!request.body.killer) te('Killer not provided', 422);

    const { killer } = request.body;
    if (!match.users.find(u => u.steamId === killer)) {
      te(`User with id ${killer} is not registered in this match`, 422);
    }

    const round = match.rounds[match.rounds.length - 1];
    const death = round.deaths.find(k => k.target === currentUser.steamId);

    if (death) te('You are already killed', 422);

    round.deaths.push({ killer, target: currentUser.steamId });

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
  } catch(error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};
