import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    user1: {
      type: String,
      ref: 'User',
      require: true,
    },
    user2: {
      type: String,
      ref: 'User',
      require: true,
    },
    lastMessage: {
      type: mongoose.Types.ObjectId,
      ref: 'Message',
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
