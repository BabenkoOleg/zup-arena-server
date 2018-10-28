const SteamService = require('../../services/Steam');

module.exports.create = (req, res) => {
  SteamService.ISteamUserAuth.AuthenticateUserTicket({
    appid: process.env.STEAM_APP_ID,
    ticket: req.body.ticket,
  })
    .then(data => res.json(data))
    .catch(error => res.json(error));
};
