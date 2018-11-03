const { Match } = require('../../db/models');

const isMatchIdValid = (matchId) => {
  const re = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
  return re.test(matchId);
};

const renderMatch = (match, response) => {
  response.json({
    success: true,
    data: {
      id: match.id,
      state: match.state,
    },
  });
};

const renderMatchWithUsers = (match, response) => {
  match.getUsers({ attributes: ['steamId'] })
    .then((users) => {
      response.json({
        success: true,
        data: {
          id: match.id,
          state: match.state,
          users: users.map(user => user.steamId),
        },
      });
    });
};

/**
 * @apiDefine MatchNotFoundError
 *
 * @apiError MatchNotFoundError Match not found
 *
 * @apiErrorExample MatchNotFoundError:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "success": false,
 *     "error": "Match with id ed3e03c3-954c-4744-9556-579caf90de05 not found"
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
 * @apiSuccess {Boolean} success Successful execution of the request
 * @apiSuccess {Object} data Match information
 * @apiSuccess {String} data.id Unique match ID
 * @apiSuccess {Number} data.state State of match
 * @apiSuccess {Array} data.users Array of users
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *     {
 *        "success": true,
 *        "data": {
 *            "id": "ed3e03c3-954c-4744-9556-579caf90de05",
 *            "state": "active",
 *            "users": [
 *                "12345678901234567"
 *            ]
 *        }
 *    }
 *
 * @apiUse TokenNotProvidedError
 * @apiUse InvalidTokenError
 * @apiUse TokenExpiredError
 * @apiUse UserNotFoundError
 */

module.exports.create = (request, response) => {
  const { currentUser } = request;
  Match.create({ createdBy: currentUser.id })
    .then((record) => {
      record.addUser(currentUser).then(() => renderMatchWithUsers(record, response));
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
 *            "id": "ed3e03c3-954c-4744-9556-579caf90de05",
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
  if (!isMatchIdValid(request.params.id)) {
    return renderMatchNotFoundError(request.params.id, response);
  }

  Match.findOne({ where: { id: request.params.id } })
    .then((record) => {
      if (!record) return renderMatchNotFoundError(request.params.id, response);

      record.update({ state: 'finished' })
        .then(updatedRecord => renderMatch(updatedRecord, response));
    });
};
