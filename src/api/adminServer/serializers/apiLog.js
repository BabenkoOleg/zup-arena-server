const Base = require('./base');

class ApiLog extends Base {
  serializeCollection(collection) {
    return collection.map(document => ({
      id: document.id,
      createdAt: document.createdAt,
      method: document.method,
      path: document.path,
      statusCode: document.statusCode,
    }));
  }

  serializeDocument(document) {
    return {
      id: document.id,
      path: document.path,
      method: document.method,
      userSteamId: document.userSteamId,
      requestHeaders: JSON.parse(document.requestHeaders),
      requestBody: JSON.parse(document.requestBody),
      responseHeaders: JSON.parse(document.responseHeaders),
      responseBody: JSON.parse(document.responseBody),
      statusCode: document.statusCode,
    };
  }
}

module.exports = ApiLog;
