const ApiLog = require('../../../models/ApiLog');
const te = require('../../../util/throwErrorWithStatus');

module.exports.index = async (request, response) => {
  const apiLogs = await ApiLog.find({}).sort('-createdAt');
  const data = apiLogs.map(apiLog => ({
    id: apiLog.id,
    createdAt: apiLog.createdAt,
    method: apiLog.method,
    path: apiLog.path,
    statusCode: apiLog.statusCode,
  }));

  response.json({ data });
};

module.exports.show = async (request, response) => {
  try {
    const apiLog = await ApiLog.findById(request.params.id);
    if (!apiLog) te(`ApiLog with id ${request.params.id} not found`, 404);

    const data = {
      id: apiLog.id,
      path: apiLog.path,
      method: apiLog.method,
      userSteamId: apiLog.userSteamId,
      requestHeaders: JSON.parse(apiLog.requestHeaders),
      requestBody: JSON.parse(apiLog.requestBody),
      responseHeaders: JSON.parse(apiLog.responseHeaders),
      responseBody: JSON.parse(apiLog.responseBody),
      statusCode: apiLog.statusCode,
    };

    response.json({ data });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};
