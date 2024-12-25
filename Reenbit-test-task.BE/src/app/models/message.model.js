import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      ref: 'User',
      require: true,
    },
    senderPicture: String,
    chat: {
      type: mongoose.Types.ObjectId,
      ref: 'Chat',
    },
    content: {
      type: String,
      require: true,
      trim: true,
    },
    isAutoResponse: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
