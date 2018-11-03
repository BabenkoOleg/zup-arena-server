const { Match } = require('../../db/models');

const renderMatchWithUsers = (match, response) => {
  match.getUsers({ attributes: ['steamId'], nested: false })
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
 *            "state": "pending",
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
