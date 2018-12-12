const bcrypt = require('bcrypt');
const SecuritySerializer = require('../serializers/security');
const te = require('../../../util/throwErrorWithStatus');

module.exports.edit = async (request, response) => {
  const { currentAdmin } = request;

  try {
    const data = new SecuritySerializer(currentAdmin).asJson();

    response.json({ data });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};

module.exports.update = async (request, response) => {
  let { currentAdmin } = request;

  try {
    if (!request.body.login) te('Login is empty', 422);

    const isPasswordValid = await bcrypt.compare(
      request.body.currentPassword || '',
      currentAdmin.encryptedPassword,
    );

    if (!isPasswordValid) te('Current password is not valid', 422);

    currentAdmin.login = request.body.login;

    if (request.body.newPassword || request.body.newPasswordConfirmation) {
      if (request.body.newPassword !== request.body.newPasswordConfirmation) {
        te('New passwords are not valid', 422);
      }

      currentAdmin.password = request.body.newPassword;
    }

    currentAdmin = await currentAdmin.save();

    const data = new SecuritySerializer(currentAdmin).asJson();

    response.json({ data });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};
