const jwt = require('jsonwebtoken');
const { User } = require('../../db/models');

const extractJwt = (row) => {
  const re = new RegExp(/Bearer\s(.+)/);
  const result = re.exec(row);
  return result ? result[1] : null;
};

const extractCurrentUser = id => User.findOne({ where: { id } })
  .then((record) => {
    if (!record) return Promise.reject(new Error(`User with id ${id} found`));
    return Promise.resolve(record);
  });

/**
 * @apiDefine TokenNotProvidedError
 *
 * @apiError TokenNotProvidedError Authorization token not provided (Missing Authorization header)
 *
 * @apiErrorExample TokenNotProvidedError:
 *   HTTP/1.1 401 Unauthorized
 *   {
 *     "success": false,
 *     "error": "Token not provided"
 *   }
 */

const renderTokenNotProvidedError = (response) => {
  response.status(401);
  response.json({
    success: false,
    error: 'Token not provided',
  });
};

/**
 * @apiDefine InvalidTokenError
 *
 * @apiError InvalidToken The authorization token is not a token signed by a server
 *
 * @apiErrorExample Error-Response:
 *   HTTP/1.1 401 Unauthorized
 *   {
 *     "success": false,
 *     "error": "Invalid Token"
 *   }
 */

const renderInvalidTokenError = (response) => {
  response.status(401);
  response.json({
    success: false,
    error: 'Invalid token',
  });
};

/**
 * @apiDefine TokenExpiredError
 *
 * @apiError TokenExpiredError Authorization token has expired
 *
 * @apiErrorExample TokenExpiredError:
 *   HTTP/1.1 401 Unauthorized
 *   {
 *     "success": false,
 *     "error": "Token expired"
 *   }
 */

const renderTokenExpiredError = (response) => {
  response.status(401);
  response.json({
    success: false,
    error: 'Token expired',
  });
};

/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFoundError User with id from token not found
 *
 * @apiErrorExample UserNotFoundError:
 *   HTTP/1.1 403 Forbidden
 *   {
 *     "success": false,
 *     "error": "User with id 93df2547-e8b8-46fa-83ef-51dd799f87e5 not found"
 *   }
 */

const renderUserNotFoundError = (response, id) => {
  response.status(403);
  response.json({
    success: false,
    error: `User with id ${id} not found`,
  });
};

module.exports = (request, response, next) => {
  if (!request.path.includes('/api/auth') && !request.path.includes('/api/docs')) {
    const jwtHeader = request.get('Authorization');
    if (!jwtHeader) return renderTokenNotProvidedError(response);

    jwt.verify(extractJwt(jwtHeader), process.env.JWT_SECRET, (jwtError, decoded) => {
      if (jwtError) {
        if (jwtError.name === 'TokenExpiredError') return renderTokenExpiredError(response);
        return renderInvalidTokenError(response);
      }

      extractCurrentUser(decoded.id)
        .then((currentUser) => {
          request.currentUser = currentUser;
          next();
        })
        .catch(() => renderUserNotFoundError(response, decoded.id));
    });
  } else {
    next();
  }
};
