const jwt = require('jsonwebtoken');
const SteamService = require('../../services/Steam');
const { User } = require('../../db/models');

/**
 * @apiDefine TicketNotProvidedError
 *
 * @apiError TicketNotProvidedError Ticket not provided
 *
 * @apiErrorExample TicketNotProvidedError:
 *   HTTP/1.1 422 Unprocessable Entity
 *   {
 *     "success": false,
 *     "error": "Ticket not provided"
 *   }
 */

const renderTicketNotProvidedError = (response) => {
  response.status(422);
  response.json({
    success: false,
    error: 'Ticket not provided',
  });
};

/**
 * @apiDefine InvalidTicketError
 *
 * @apiError InvalidTicketError Ticket is invalid
 *
 * @apiErrorExample InvalidTicketError:
 *   HTTP/1.1 422 Unprocessable Entity
 *   {
 *     "success": false,
 *     "error": "Invalid ticket",
 *     "steamError": {}
 *   }
 */

const renderInvalidTicketError = (response, steamError) => {
  response.status(422);
  response.json({
    success: false,
    error: 'Invalid ticket',
    steamError,
  });
};

/**
 * @api {post} /api/auth Request User authorization through the steam ticket
 * @apiName GetJWT
 * @apiVersion 0.1.0
 * @apiGroup Auth
 *
 * @apiParam {String} ticket Convert the ticket from GetAuthSessionTicket from binary to hex into
 * an appropriately sized byte character array and pass the result in as this ticket parameter.
 *
 * @apiParamExample {json} Request-Example:
                    { "ticket": "14000000252D6B3A43B98070A3DE8716010010012659DB5B18..." }
 *
 * @apiSuccess {Boolean} success Successful execution of the request
 * @apiSuccess {String} jwt JSON Web Token (JWT)
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "success": true,
 *     "jwt": "xxx.yyy.zzz"
 *   }
 *
 * @apiUse TicketNotProvidedError
 * @apiUse InvalidTicketError
 */

module.exports.create = (request, response) => {
  if (!request.body.ticket) return renderTicketNotProvidedError(response);
  SteamService.ISteamUserAuth.AuthenticateUserTicket({
    appid: process.env.STEAM_APP_ID,
    ticket: request.body.ticket,
  })
    .then((data) => {
      User.findOrCreate({ where: { steamId: data.response.params.steamid } })
        .spread((record) => {
          const token = jwt.sign({
            steamId: record.steamId,
            id: record.id,
          }, process.env.JWT_SECRET, {
            expiresIn: '1h',
          });
          response.json({ success: true, jwt: token });
        });
    })
    .catch(error => renderInvalidTicketError(response, error));
};

if (process.env.NODE_ENV === 'development') {
  module.exports.testUser = (request, response) => {
    User.findOne({ where: { steamId: '00000000000000000' } })
      .then((record) => {
        const token = jwt.sign({
          steamId: record.steamId,
          id: record.id,
        }, process.env.JWT_SECRET, {
          expiresIn: '7d',
        });
        response.json({ success: true, jwt: token });
      });
  };
}
