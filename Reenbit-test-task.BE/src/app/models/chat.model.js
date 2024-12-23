import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        user: {
          type: String,
          ref: 'User',
          require: true,
        },
        lastViewedAt: {
          type: Date,
          default: new Date(0),
        },
      },
    ],
    lastMessage: {
      type: mongoose.Types.ObjectId,
      ref: 'Message',
    },
    chatType: {
      type: String,
      default: 'AutoResponse', // 'AutoResponse', 'Personal', 'Group'
    },
    name: String,
    chatImage: String,
    virtualUser: {
      firstName: String,
      lastName: String,
      profilePicture: String,
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
