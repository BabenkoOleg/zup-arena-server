const crypto = require('crypto');

const hexWithDashes = buffer => buffer.toString('hex').toUpperCase().match(/\w{2}/g).join('-');

const randomAesKey = () => crypto.randomBytes(32).toString('hex').toUpperCase();

const randomAesIv = () => crypto.randomBytes(16).toString('hex').toUpperCase();

const encrypt = (message, hexKey, hexIv) => {
  const key = Buffer.from(hexKey, 'hex');
  const iv = Buffer.from(hexIv, 'hex');

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(message);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return encrypted.toString('hex');
};

const decrypt = (message, hexKey, hexIv) => {
  const key = Buffer.from(hexKey, 'hex');
  const iv = Buffer.from(hexIv, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const encryptedText = Buffer.from(`${message}:hex`, 'hex');
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

module.exports = {
  hexWithDashes,
  randomAesKey,
  randomAesIv,
  encrypt,
  decrypt,
};
