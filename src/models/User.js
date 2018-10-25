import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  level: { type: Number, default: 0 },
  money: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  steamId: { type: String, unique: true },
  xp: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

export default User;
