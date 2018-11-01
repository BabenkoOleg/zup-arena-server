const jwt = require('jsonwebtoken');
const SteamService = require('../../services/Steam');
const { User } = require('../../db/models');

module.exports.create = (request, response) => {
  if (request.body.ticket) {
    SteamService.ISteamUserAuth.AuthenticateUserTicket({
      appid: process.env.STEAM_APP_ID,
      ticket: request.body.ticket,
    })
      .then((data) => {
        User.findOrCreate({ where: { steamId: data.response.params.steamid } })
          .spread((record) => {
            const token = jwt.sign({
              steamId: record.steamId,
              uuid: record.uuid,
            }, process.env.JWT_SECRET, {
              expiresIn: '1h',
            });
            response.json({ success: true, jwt: token });
          });
      })
      .catch((error) => {
        response.status(422);
        response.json({
          success: false,
          error: 'Invalid token',
          steamError: error,
        });
      });
  } else {
    response.status(422);
    response.json({
      success: false,
      error: 'Not provided token parameter',
    });
  }
};
