const jwt = require('jsonwebtoken');

const extractJwt = (row) => {
  const re = new RegExp(/Bearer\s(.+)/);
  const result = re.exec(row);
  return result ? result[1] : null;
};

const renderError = (response, error) => {
  response.status(401);
  response.json({ success: false, error });
};

module.exports = (request, response, next) => {
  if (request.path !== '/api/auth') {
    const jwtHeader = request.get('Authorization');
    if (!jwtHeader) return renderError(response, 'Token not provided');

    jwt.verify(extractJwt(jwtHeader), process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        if (error.name === 'TokenExpiredError') return renderError(response, 'Token expired');
        return renderError(response, 'Invalid token');
      }
      next();
    });
  } else {
    next();
  }
};
