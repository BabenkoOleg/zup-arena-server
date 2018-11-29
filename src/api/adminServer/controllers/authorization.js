const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../../../models/Admin');
const logger = require('../../../util/logger');
const te = require('../../../util/throwErrorWithStatus');

module.exports.create = async (request, response) => {
  try {
    if (!request.body.login) te('Login is empty', 422);
    if (!request.body.password) te('Password is empty', 422);

    const admin = await Admin.findOne({ login: request.body.login });

    if (!admin) te('Invalid login or password', 422);

    const isPasswordValid = await bcrypt.compare(request.body.password, admin.encryptedPassword);

    if (isPasswordValid) {
      const payload = { id: admin.id, login: admin.login };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });
      response.json({ jwt: token });
    } else {
      te('Invalid login or password', 422);
    }
  } catch (error) {
    logger.error(error.message);
    response.status(error.status || 500).json({ error: error.message });
  }
};
