const jwt = require('jsonwebtoken');
const { User } = require('../../db/models');

const extractJwt = (row) => {
  const re = new RegExp(/Bearer\s(.+)/);
  const result = re.exec(row);
  return result ? result[1] : null;
};

const extractCurrentUser = (uuid) => {
  User.findOne({ where: { uuid } })
    .then((record) => {
      if (!record) return Promise.reject(new Error(`User with uuid ${uuid} found`));
      return Promise.resolve(record);
    });
};

const renderError = (response, error) => {
  response.status(401);
  response.json({ success: false, error });
};

module.exports = (request, response, next) => {
  if (request.path !== '/api/auth') {
    const jwtHeader = request.get('Authorization');
    if (!jwtHeader) return renderError(response, 'Token not provided');

    jwt.verify(extractJwt(jwtHeader), process.env.JWT_SECRET, (jwtError, decoded) => {
      if (jwtError) {
        if (jwtError.name === 'TokenExpiredError') return renderError(response, 'Token expired');
        return renderError(response, 'Invalid token');
      }

      extractCurrentUser(decoded.uuid)
        .then((currentUser) => {
          request.currentUser = currentUser;
          next();
        })
        .catch(dbError => renderError(response, dbError.message));
    });
  } else {
    next();
  }
};
