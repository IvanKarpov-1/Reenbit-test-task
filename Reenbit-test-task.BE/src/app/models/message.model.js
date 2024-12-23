import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      ref: 'User',
      require: true,
    },
    chat: {
      type: mongoose.Types.ObjectId,
      ref: 'Chat',
    },
    content: {
      type: String,
      require: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
