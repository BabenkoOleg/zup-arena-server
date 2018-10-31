const jwt = require('jsonwebtoken');
const SteamService = require('../../services/Steam');
const { User } = require('../../db/models');
const logger = require('../../util/logger');

module.exports.create = (req, res) => {
  logger.info(req.body);
  if (req.body.ticket) {
    SteamService.ISteamUserAuth.AuthenticateUserTicket({
      appid: process.env.STEAM_APP_ID,
      ticket: req.body.ticket,
    })
      .then((data) => {
        User.findOrCreate({ where: { steamId: data.response.params.steamid } })
          .spread((record) => {
            const token = jwt.sign({
              steamId: record.steamId,
              uuid: record.uuid,
            }, process.env.JWT_SECRET);
            res.json({ success: true, jwt: token });
          });
      })
      .catch((error) => {
        res.status(422);
        res.json({
          success: false,
          error: 'Invalid token',
          steamError: error,
        });
      });
  } else {
    res.status(422);
    res.json({
      success: false,
      error: 'Not provided token parameter',
    });
  }
};
