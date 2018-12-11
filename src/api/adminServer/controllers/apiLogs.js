const ApiLog = require('../../../models/ApiLog');
const ApiLogSerializer = require('../serializers/apiLog');
const te = require('../../../util/throwErrorWithStatus');

module.exports.index = async (request, response) => {
  const apiLogs = await ApiLog.find({}).sort('-createdAt');

  const data = new ApiLogSerializer(apiLogs).asJson();

  response.json({ data });
};

module.exports.show = async (request, response) => {
  try {
    const apiLog = await ApiLog.findById(request.params.id);
    if (!apiLog) te(`ApiLog with id ${request.params.id} not found`, 404);

    const data = new ApiLogSerializer(apiLog).asJson();

    response.json({ data });
  } catch (error) {
    response.status(error.status || 500).json({ error: error.message });
  }
};
