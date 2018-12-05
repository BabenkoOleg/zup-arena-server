const Match = require('../../../models/Match');
const User = require('../../../models/User');
const te = require('../../../util/throwErrorWithStatus');

module.exports.index = async (request, response) => {
  const matches = await Match.find({}).sort('-createdAt');
  const data = matches.map(match => ({
    id: match.id,
    state: match.state,
    createdAt: match.createdAt,
  }));

  response.json({ data });
};

module.exports.show = async (request, response) => {
  try {
    const match = await Match.findById(request.params.id);
    if (!match) te(`Match with id ${request.params.id} not found`, 404);

    const users = await User.find({ steamId: match.users.map(u => u.steamId) });

    const getUserName = (steamId) => {
      const user = users.find(u => u.steamId === steamId);
      return user ? user.steamName : null;
    };

    const data = {
      id: match.id,
      state: match.state,
      createdAt: match.createdAt,
      users: match.users.map(user => ({
        steamId: user.steamId,
        steamName: getUserName(user.steamId),
        team: user.team,
        isWinner: user.isWinner,
        frags: user.frags,
        deserter: user.deserter,
        awards: user.awards,
      })),
      rounds: match.rounds.map((round, i) => ({
        number: (i + 1),
        winningTeams: round.winningTeams,
        timeIsUp: round.timeIsUp,
        kills: round.kills.map(kill => ({
          killer: kill.killer,
          killerName: getUserName(kill.killer),
          killerTeam: match.users.find(user => user.steamId === kill.killer).team,
          target: kill.target,
          targetName: getUserName(kill.target),
          targetTeam: match.users.find(user => user.steamId === kill.target).team,
        })),
      })),
    };

    response.json({ data });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};
