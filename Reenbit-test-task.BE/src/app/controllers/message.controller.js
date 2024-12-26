import { getSubFromJwt } from '../utils/getSubFromJwt.js';
import Message from '../models/message.model.js';
import Chat from '../models/chat.model.js';

export const getMessages = async (req, res) => {
  const userId = getSubFromJwt(req.auth);

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const chatId = req.params.chatId;

  const messages = await Message.find({ chat: chatId })
    .populate('sender')
    .sort({ createdAt: 1 })
    .exec();

  return res.status(200).json(messages);
};

export const createMessage = async (req, res) => {
  const { result, status, json, userId, chatId, chat } = await doChecks(req);

  if (!result) {
    return res.status(status).json(json);
  }

  const content = req.body.content;

  let message = await Message.create({
    sender: userId,
    chat: chatId,
    content: content,
  });

  message = await Message.findById(message._id).populate('sender').exec();
  message.senderPicture = message.sender.profilePicture;

  chat.lastMessage = message._id;

  await chat.save();

  return res.status(201).json(message);
};

export const createAutoResponseMessage = async (req, res) => {
  const { result, status, json, chatId, chat } = await doChecks(req);

  if (!result) {
    return res.status(status).json(json);
  }

  if (!chat.chatType === 'AutoResponse') {
    return res.status(201).json({ message: 'Wrong type of chat' });
  }

  const randomQuote = await fetch('https://stoic.tekloon.net/stoic-quote');
  const randomQuoteData = await randomQuote.json();

  const autoResponse = await Message.create({
    senderPicture: chat.virtualUser.profilePicture,
    chat: chatId,
    content: randomQuoteData.data.quote,
    isAutoResponse: true,
  });

  chat.lastMessage = autoResponse._id;

  await chat.save();

  return res.status(201).json({
    _id: autoResponse._id,
    senderPicture: chat.virtualUser.profilePicture,
    sender: {
      firstName: chat.virtualUser.firstName,
      lastName: chat.virtualUser.lastName,
    },
    chat: chatId,
    content: randomQuoteData.data.quote,
    isAutoResponse: true,
    createdAt: autoResponse.createdAt,
  });
};

export const updateMessage = async (req, res) => {
  const userId = getSubFromJwt(req.auth);

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const messageId = req.params.messageId;
  const content = req.body.content;

  const message = await Message.findById(messageId).exec();

  if (message.sender !== userId) {
    return res
      .status(403)
      .json({ error: 'You can edit only your own message' });
  }

  message.content = content;
  await message.save();

  return res.status(200).json({ message: 'Message was successfully updated' });
};

export const deleteMessage = async (req, res) => {
  const userId = getSubFromJwt(req.auth);

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const messageId = req.params.messageId;

  const result = await Message.deleteOne({
    _id: messageId,
    sender: userId,
  }).exec();

  return result.deletedCount === 0
    ? res
        .status(404)
        .json({ error: 'Message not found', details: error.errors })
    : res
        .status(204)
        .json({ message: 'Message has been successfully deleted' });
};

const doChecks = async (req) => {
  const userId = getSubFromJwt(req.auth);

  if (!userId)
    return {
      result: false,
      status: 401,
      json: { error: 'Unauthorized' },
    };

  const chatId = req.params.chatId;

  const chat = await Chat.findOne({
    _id: chatId,
    'participants.user': userId,
  }).exec();

  if (!chat)
    return {
      result: false,
      status: 404,
      json: { error: 'Chat not found' },
    };

  return {
    result: true,
    userId: userId,
    chatId: chatId,
    chat: chat,
  };
};
