const interceptor = require('express-interceptor');
const ApiLog = require('../../../models/ApiLog');

const apiLogger = interceptor((request, response) => ({
  isInterceptable: () => true,
  intercept(body, send) {
    ApiLog.create({
      path: request.originalUrl,
      method: request.method,
      requestHeaders: JSON.stringify(request.headers),
      requestBody: JSON.stringify(request.body),
      responseHeaders: JSON.stringify(response.getHeaders()),
      responseBody: body,
      statusCode: response.statusCode,
    });

    send(body);
  },
}));

module.exports = apiLogger;
