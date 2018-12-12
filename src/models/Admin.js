const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const schema = new Schema({
  login: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  email: String,
  password: String,
  encryptedPassword: String,
});

schema.pre('save', async function () {
  if (this.password) {
    this.encryptedPassword = await bcrypt.hash(this.password, 10);
    this.password = null;
  }
});

const Admin = mongoose.model('Admin', schema);

module.exports = Admin;
