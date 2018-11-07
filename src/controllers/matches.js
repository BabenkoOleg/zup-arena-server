// const { User, Match, Sequelize } = require('../../db/models');
const mongoose = require('mongoose');
const Match = require('../models/Match');

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
 * @apiParamExample {json} Request-Example for single mode:
 *                  { "users": ["12345678901234567", "12345678901234568"] }
 * @apiParamExample {json} Request-Example for team mode:
 *                  { "users": [["12345678901234567"], ["12345678901234568"]] }
 *
 * @apiSuccess {Boolean} success Successful execution of the request
 * @apiSuccess {Object} data Match information
 * @apiSuccess {String} data.id Unique match ID
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *     {
 *        "success": true,
 *        "data": {
 *            "id": "5bde329b36dea19ab15d6ddb"
 *        }
 *    }
 */

module.exports.create = (request, response) => {
  if (!request.body.users || !Array.isArray(request.body.users)) {
    response.status(422);
    response.json({ success: false, error: 'Users list not provided' });
  } else {
    Match.createFromUsersList(request.body.users, (error, match) => {
      if (error) {
        response.status(422);
        response.json({ success: false, error });
      } else {
        response.json({
          success: true,
          data: {
            id: match.id,
            state: match.state,
            users: match.users.map(user => user.steamId),
          },
        });
      }
    });
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
 * @api {post} /api/matches/:id/kill Request kill User
 * @apiName KillMatch
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
 * @apiParam {String} target Killed user steamIs
 *
 * @apiParamExample {json} Request-Example:
 *                  { "target": "12345678901234567" }
 *
 * @apiSuccess {Boolean} success Successful execution of the request
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *     {
 *        "success": true,
 *     }
 */

module.exports.kill = (request, response) => {
  const { currentUser } = request;

  if (!request.body.target) {
    return response.status(422)
      .response.json({ success: false, error: 'Target not provided' });
  }

  Match.findById(request.params.id, (error, match) => {
    if (!match) {
      return response.status(404)
        .json({ success: false, error: `Match with id ${request.params.id} not found` });
    }

    match.killUser(currentUser, request.body.target, (killError) => {
      if (killError) return response.status(422).json({ success: false, error: killError });
      response.json({ success: true });
    });
  });
};

/**
 * @api {post} /api/matches/:id/death Request confirm kill
 * @apiName DeathMatch
 * @apiVersion 0.1.0
 * @apiGroup Match
 *
 * @apiPermission Authorized users only
 * @apiHeader {String} Authorization Server-signed authentication token
 * @apiHeaderExample {json} Header-Example:
 *   {
 *     "Authorization": "Bearer xxx.zzz.yyy"
 *   }

 * @apiParam {String} target Killer user steamIs
 *
 * @apiParamExample {json} Request-Example:
 *                  { "killer": "12345678901234567" }
 *
 *
 * @apiSuccess {Boolean} success Successful execution of the request
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *     {
 *        "success": true,
 *     }
 */

module.exports.death = (request, response) => {
  const { currentUser } = request;

  if (!request.body.killer) {
    return response.status(422)
      .response.json({ success: false, error: 'Killer not provided' });
  }

  Match.findById(request.params.id, (error, match) => {
    if (!match) {
      return response.status(404)
        .json({ success: false, error: `Match with id ${request.params.id} not found` });
    }

    match.death(currentUser, request.body.killer, (deathError) => {
      if (deathError) return response.status(422).json({ success: false, error: deathError });
      response.json({ success: true });
    });
  });
};
