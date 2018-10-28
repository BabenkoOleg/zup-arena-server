const jwt = require('jsonwebtoken');
const { User } = require('../../db/models');

const handler = (io, client) => (message) => {
  jwt.verify(message.jwt, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      client.emit('authenticated', { success: false, error: 'Invalid token' });
      client.disconnect();
    } else {
      User.findOne({ where: { steamId: decoded.steamId } })
        .then((record) => {
          if (record) {
            client.emit('authenticated', {
              success: true,
              message: 'Successfully authorized',
            });
          } else {
            client.emit('authenticated', {
              success: false,
              error: `User with steamId ${decoded.steamId} not found`,
            });
            client.disconnect();
          }
        });
    }
  });
};

module.exports = handler;
