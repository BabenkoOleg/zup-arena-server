const User = require('../../../models/User');
const te = require('../../../util/throwErrorWithStatus');

module.exports.index = async (request, response) => {
  const users = await User.find({}).sort('-level');
  const data = users.map(user => ({
    steamId: user.steamId,
    steamName: user.steamName,
    level: user.level,
    rank: user.rank,
    money: user.money,
    frags: user.frags.enemies,
    xp: user.xp,
    banned: user.banned,
    matches: user.matches.victories + user.matches.defeats,
  }));

  response.json({ data });
};

module.exports.show = async (request, response) => {
  try {
    const user = await User.findOne({ steamId: request.params.id });
    if (!user) te(`User with steamId ${request.params.id} not found`, 404);

    const matchesTotal = user.matches.victories + user.matches.defeats;
    const matchesWinningPercentage = user.matches.victories / matchesTotal * 100;

    const data = {
      steamId: user.steamId,
      steamName: user.steamName,
      steamAvatar: user.steamAvatar,
      steamCountryCode: user.steamCountryCode,
      banned: user.banned,
      money: user.money,
      xp: user.xp,
      level: user.level,
      rank: user.rank,
      frags: {
        enemies: user.frags.enemies,
        teammates: user.frags.teammates,
        suicides: user.frags.suicides,
      },
      matches: {
        total: matchesTotal,
        victories: user.matches.victories,
        defeats: user.matches.defeats,
        winningPercentage: matchesWinningPercentage.toFixed(2),
      },
      desertions: user.desertions,
      activeMatch: user.activeMatch,
      lastLoginAt: user.lastLoginAt,
      lastActivityAt: user.lastActivityAt,
    };

    response.json({ data });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};

module.exports.update = async (request, response) => {
  try {
    let user = await User.findOne({ steamId: request.params.id });
    if (!user) te(`User with steamId ${request.params.id} not found`, 404);

    user = await user.update({ $set: request.body });

    response.json({ data: user });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};
