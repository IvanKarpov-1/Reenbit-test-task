import User from '../models/user.model.js';
import Chat from '../models/chat.model.js';
import Message from '../models/message.model.js';

let _sessionUser = new Map();
let _io;

const messageSocket = (io, socket, sessionUser) => {
  _io = io;
  _sessionUser = sessionUser;

  socket.on('disconnected', () => {
    const userId = sessionUser.get(socket.id);
    if (userId) {
      sessionUser.delete(socket.id);
    }
  });
};

setInterval(async () => {
  if (!_io) {
    return;
  }

  const randomUserIndex = Math.floor(Math.random() * _sessionUser.size);
  const randomUserId = Array.from(_sessionUser.values())[randomUserIndex];

  const user = await User.findById(randomUserId)
    .select('settings.isSendRandomAutomaticMessages')
    .exec();

  if (!user.settings.isSendRandomAutomaticMessages) {
    return;
  }

  const chatsCount = await Chat.find({
    'participants.user': randomUserId,
    chatType: 'AutoResponse',
  })
    .countDocuments()
    .exec();

  if (chatsCount === 0) {
    return;
  }

  const randomChatNumber = Math.floor(Math.random() * chatsCount);

  const chats = await Chat.find({
    'participants.user': randomUserId,
    chatType: 'AutoResponse',
  })
    .sort({ createdAt: 1 })
    .skip(randomChatNumber)
    .limit(1)
    .exec();

  if (chats.length === 0) {
    return;
  }

  const randomQuote = await fetch('https://stoic.tekloon.net/stoic-quote');
  const randomQuoteData = await randomQuote.json();

  const autoResponse = await Message.create({
    senderPicture: chats[0].virtualUser.profilePicture,
    chat: chats[0]._id,
    content: randomQuoteData.data.quote,
    isAutoResponse: true,
  });

  chats[0].lastMessage = autoResponse._id;

  await chats[0].save();

  _io.to(randomUserId).emit('receiveMessage', {
    _id: autoResponse._id,
    senderPicture: chats[0].virtualUser.profilePicture,
    sender: {
      firstName: chats[0].virtualUser.firstName,
      lastName: chats[0].virtualUser.lastName,
    },
    chat: { _id: chats[0]._id },
    content: randomQuoteData.data.quote,
    isAutoResponse: true,
    createdAt: autoResponse.createdAt,
  });
}, 600000);

export default messageSocket;
