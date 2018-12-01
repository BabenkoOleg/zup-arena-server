const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  path: String,
  method: String,
  userSteamId: String,
  requestHeaders: String,
  requestBody: String,
  responseHeaders: String,
  responseBody: String,
  statusCode: Number,
}, {
  timestamps: true,
});

const ApiLog = mongoose.model('ApiLog', schema);

module.exports = ApiLog;
