const jwt = require('jsonwebtoken');
const Admin = require('../../../models/Admin');
const te = require('../../../util/throwErrorWithStatus');

const extractToken = (request) => {
  const jwtHeader = request.get('Authorization');
  if (!jwtHeader) te('Authorization header not provided', 401);

  const re = new RegExp(/Bearer\s(.+)/);
  const result = re.exec(jwtHeader);

  if (!result || !result[1]) te('Invalid Authorizaton header', 401);
  return result[1];
};

module.exports = async (request, response, next) => {
  if (request.path.includes('/auth')) return next();

  try {
    const token = extractToken(request);

    let decoded = null;

    try {
      decoded = await jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      const message = error.name === 'TokenExpiredError' ? 'JWT is expired' : 'JWT is invalid';
      te(message, 401);
    }

    const admin = await Admin.findById(decoded.id);
    request.currentAdmin = admin;
    next();
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};
