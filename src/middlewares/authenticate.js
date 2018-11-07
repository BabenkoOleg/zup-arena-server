const jwt = require('jsonwebtoken');
const User = require('../models/User');

const extractJwt = (row) => {
  const re = new RegExp(/Bearer\s(.+)/);
  const result = re.exec(row);
  return result ? result[1] : null;
};

module.exports = (request, response, next) => {
  if (request.path.includes('/auth') || request.path.includes('/docs')) return next();

  const jwtHeader = request.get('Authorization');

  if (!jwtHeader) {
    response.status(401);
    response.json({
      success: false,
      error: 'Token not provided',
    });
  } else {
    jwt.verify(extractJwt(jwtHeader), process.env.JWT_SECRET, (jwtError, decoded) => {
      if (jwtError) {
        response.status(401);
        if (jwtError.name === 'TokenExpiredError') {
          response.json({ success: false, error: 'Token expired' });
        } else {
          response.json({ success: false, error: 'Invalid token' });
        }
      } else {
        User.findById(decoded.id)
          .populate('activeMatch', 'id')
          .exec((error, user) => {
            if (error) {
              response.status(401);
              response.json({
                success: false,
                error: `User with id ${decoded.id} not found`,
              });
            } else {
              request.currentUser = user;
              next();
            }
          });
      }
    });
  }
};
