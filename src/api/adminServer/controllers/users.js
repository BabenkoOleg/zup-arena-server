const User = require('../../../models/User');
const UserSerializer = require('../serializers/user');
const te = require('../../../util/throwErrorWithStatus');

module.exports.index = async (request, response) => {
  const users = await User.find({}).sort('-level');

  const data = new UserSerializer(users).asJson();

  response.json({ data });
};

module.exports.show = async (request, response) => {
  try {
    const user = await User.findOne({ steamId: request.params.id });
    if (!user) te(`User with steamId ${request.params.id} not found`, 404);

    const data = new UserSerializer(user).asJson();

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

    const data = new UserSerializer(user).asJson();

    response.json({ data });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};
