const jwt = require('jsonwebtoken');
const SteamService = require('../../services/Steam');
const { User } = require('../../db/models');

module.exports.create = (req, res) => {
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
          res.json({ jwt: token });
        });
    })
    .catch(error => res.json(error));
};
