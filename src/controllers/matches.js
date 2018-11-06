// const { User, Match, Sequelize } = require('../../db/models');
const mongoose = require('mongoose');
const Match = require('../models/Match');

/**
 * @apiDefine MatchNotFoundError
 *
 * @apiError MatchNotFoundError Match not found
 *
 * @apiErrorExample MatchNotFoundError:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "success": false,
 *     "error": "Match with id 5bde2fe8191c439993275761 not found"
 *   }
 */

const renderMatchNotFoundError = (matchId, response) => {
  response.status(404);
  response.json({
    success: false,
    error: `Match with id ${matchId} not found`,
  });
};

/**
 * @apiDefine UsersListNotProvidedError
 *
 * @apiError UsersListNotProvidedError List of user's steamIds not provided
 *
 * @apiErrorExample UsersListNotProvidedError:
 *   HTTP/1.1 422 Unprocessable Entity
 *   {
 *     "success": false,
 *     "error": "Users list not provided"
 *   }
 */

const renderUsersListNotProvidedError = (response) => {
  response.status(422);
  response.json({
    success: false,
    error: 'Users list not provided',
  });
};

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
 * @apiParam {Array} users List of user's steamIds
 *
 * @apiParamExample {json} Request-Example:
 *                  { "users": ["12345678901234567", "12345678901234568", "12345678901234569"] }
 *
 * @apiSuccess {Boolean} success Successful execution of the request
 * @apiSuccess {Object} data Match information
 * @apiSuccess {String} data.id Unique match ID
 * @apiSuccess {Number} data.state State of match
 * @apiSuccess {Array[String]} data.users Array of users
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *     {
 *        "success": true,
 *        "data": {
 *            "id": "5bde329b36dea19ab15d6ddb",
 *            "state": "active",
 *            "users": [
 *                "12345678901234567",
 *                "12345678901234568",
 *                "12345678901234569"
 *            ]
 *        }
 *    }
 *
 * @apiUse UsersListNotProvidedError
 * @apiUse TokenNotProvidedError
 * @apiUse InvalidTokenError
 * @apiUse TokenExpiredError
 * @apiUse UserNotFoundError
 */

module.exports.create = (request, response) => {
  if (!request.body.users || !Array.isArray(request.body.users)) {
    return renderUsersListNotProvidedError(response);
  }

  Match.createFromUsersList(request.body.users, (error, match) => {
    response.json({
      success: true,
      data: {
        id: match.id,
        state: match.state,
        users: match.users.map(user => user.steamId),
      },
    });
  });
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
 *
 * @apiUse MatchNotFoundError
 * @apiUse TokenNotProvidedError
 * @apiUse InvalidTokenError
 * @apiUse TokenExpiredError
 * @apiUse UserNotFoundError
 */

module.exports.finish = (request, response) => {
  const query = { _id: mongoose.Types.ObjectId(request.params.id) };
  const update = { finished: true };
  const options = { new: true };

  Match.findOneAndUpdate(query, update, options, (error, record) => {
    if (error || !record) return renderMatchNotFoundError(request.params.id, response);

    response.json({
      success: true,
      data: {
        id: record.id,
        finished: record.finished,
      },
    });
  });
};
