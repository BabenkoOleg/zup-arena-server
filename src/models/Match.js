const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  finished: { type: Boolean, default: false },
  finishedAt: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const Match = mongoose.model('Match', schema);

module.exports = Match;
