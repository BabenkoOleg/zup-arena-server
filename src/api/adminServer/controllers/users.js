const User = require('../../../models/User');
const te = require('../../../util/throwErrorWithStatus');

module.exports.index = async (request, response) => {
  const users = await User.find({}).sort('-createdAt');
  const data = users.map(user => ({
    steamId: user.steamId,
    level: user.level,
    rank: user.rank,
    money: user.money,
    xp: user.xp,
    frags: user.frags,
    matches: user.matches,
    activeMatch: user.activeMatch,
  }));

  response.json({ data });
};

module.exports.show = async (request, response) => {
  try {
    const user = await User.findOne({ steamId: request.params.id });
    if (!user) te(`User with steamId ${request.params.id} not found`, 404);

    const data = {
      steamId: user.steamId,
      money: user.money,
      xp: user.xp,
      level: user.level,
      rank: user.rank,
      frags: user.frags,
      matches: user.matches,
      activeMatch: user.activeMatch,
    };

    response.json({ data });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};
