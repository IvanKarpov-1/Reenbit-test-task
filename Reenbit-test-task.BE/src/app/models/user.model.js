import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: String,
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  lastLogin: Date,
});

const User = mongoose.model('User', userSchema);

export default User;
