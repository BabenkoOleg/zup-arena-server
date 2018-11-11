const jwt = require('jsonwebtoken');
const User = require('../models/User');
const te = require('../util/throwErrorWithStatus');

const extractToken = (request) => {
  const jwtHeader = request.get('Authorization');
  if (!jwtHeader) te('Authorization header not provided', 401);

  const re = new RegExp(/Bearer\s(.+)/);
  const result = re.exec(jwtHeader);

  if (!result || !result[1]) te('Invalid Authorizaton header', 401);
  return result[1];
};

module.exports = async (request, response, next) => {
  if (request.path.includes('/auth') || request.path.includes('/docs')) return next();

  try {
    const token = extractToken(request);

    let decoded = null;

    try {
      decoded = await jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      const message = error.name === 'TokenExpiredError' ? 'JWT is expired' : 'JWT is invalid';
      te(message, 401);
    }

    const user = await User.findById(decoded.id).populate('activeMatch', 'id').exec();
    request.currentUser = user;
    next();
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};
