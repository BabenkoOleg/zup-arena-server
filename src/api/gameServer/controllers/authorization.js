const jwt = require('jsonwebtoken');
const SteamService = require('../../../services/Steam');
const User = require('../../../models/User');
const logger = require('../../../util/logger');
const te = require('../../../util/throwErrorWithStatus');

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
 *   {
 *     "ticket": "14000000252D6B3A43B98070A3DE8716010010012659DB5B18..."
 *   }
 *
 * @apiSuccess {String} jwt JSON Web Token (JWT)
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "jwt": "xxx.yyy.zzz"
 *   }
 */

module.exports.create = async (request, response) => {
  try {
    if (!request.body.ticket) te('Authorization ticket is not provided in the request body', 422);

    let steamResponse = await SteamService.ISteamUserAuth.AuthenticateUserTicket({
      appid: process.env.STEAM_APP_ID,
      ticket: request.body.ticket,
    });

    let steamId = null;

    try {
      steamId = steamResponse.response.params.steamid;
    } catch (error) {
      logger.error(error.message);
      te('Invalid steam authorization ticket', 422);
    }

    const query = { steamId };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const user = await User.findOneAndUpdate(query, {}, options);

    if (user.banned) te('Banned', 401);

    const now = Date.now();
    user.lastActivityAt = now;
    user.lastLoginAt = now;

    try {
      steamResponse = await SteamService.ISteamUser.GetPlayerSummaries({
        steamids: steamId,
      });
      user.steamName = steamResponse.response.players.player[0].personaname;
      user.steamAvatar = steamResponse.response.players.player[0].avatarfull;
      user.steamCountryCode = steamResponse.response.players.player[0].loccountrycode;
    } catch (error) { }

    await user.save();

    const payload = { steamId: user.steamId, id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    response.json({ jwt: token });
  } catch (error) {
    logger.error(error.message);
    response.status(error.status || 500).json({ error: error.message });
  }
};

module.exports.testUser = async (request, response) => {
  const query = { steamId: request.params.id || '00000000000000000' };
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };

  try {
    const user = await User.findOneAndUpdate(query, {}, options);

    if (user.banned) te('Banned', 401);

    const payload = { steamId: user.steamId, id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    response.json({ jwt: token });
  } catch (error) {
    logger.error(error.message);
    response.status(error.status || 500).json({ error: error.message });
  }
};
