const Match = require('../../../models/Match');
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

    const data = {
      id: match.id,
      state: match.state,
      createdAt: match.createdAt,
      users: match.users.map(user => ({
        steamId: user.steamId,
        steamName: user.steamName,
        team: user.team,
        isWinner: user.isWinner,
        frags: user.frags,
        left: user.left,
        awards: user.awards,
      })),
      rounds: match.rounds.map((round, i) => ({
        number: (i + 1),
        winningTeams: round.winningTeams,
        timeIsUp: round.timeIsUp,
        kills: round.kills.map(kill => ({
          killer: kill.killer,
          killerTeam: match.users.find(user => user.steamId === kill.killer).team,
          target: kill.target,
          targetTeam: match.users.find(user => user.steamId === kill.target).team,
        })),
      })),
    };

    response.json({ data });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};
