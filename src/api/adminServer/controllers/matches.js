const Match = require('../../../models/Match');
const MatchSerializer = require('../serializers/match');
const User = require('../../../models/User');
const te = require('../../../util/throwErrorWithStatus');

module.exports.index = async (request, response) => {
  const matches = await Match.find({}).sort('-createdAt');

  const data = new MatchSerializer(matches).asJson();

  response.json({ data });
};

module.exports.show = async (request, response) => {
  try {
    const match = await Match.findById(request.params.id);
    if (!match) te(`Match with id ${request.params.id} not found`, 404);

    const users = await User.find({ steamId: match.users.map(u => u.steamId) });

    const data = new MatchSerializer(match, { users }).asJson();

    response.json({ data });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};
