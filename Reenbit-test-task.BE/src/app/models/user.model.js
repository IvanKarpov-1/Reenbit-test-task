import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: String,
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  profilePicture: String,
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  lastLogin: Date,
});

const User = mongoose.model('User', userSchema);

export default User;
