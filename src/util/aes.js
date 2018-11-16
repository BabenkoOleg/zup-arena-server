const crypto = require('crypto');

const hexWithDashes = buffer => buffer.toString('hex').toUpperCase().match(/\w{2}/g).join('-');

const randomAesKey = () => crypto.randomBytes(32).toString('hex').toUpperCase();

const randomAesIv = () => crypto.randomBytes(16).toString('hex').toUpperCase();

module.exports = {
  hexWithDashes,
  randomAesKey,
  randomAesIv,
};
