import { getSubFromJwt } from '../utils/getSubFromJwt.js';
import Chat from '../models/chat.model.js';

export const getChats = async (req, res) => {
  const userId = getSubFromJwt(req.auth);

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const chats = await Chat.find({ 'participants.user': userId })
    .populate('participants.user', 'firstName lastName profilePicture')
    .populate('lastMessage')
    .exec();

  return res.status(200).json(chats);
};

export const getChat = async (req, res) => {
  const userId = getSubFromJwt(req.auth);

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const chatId = req.params.chatId;

  const chat = await Chat.findOne({ _id: chatId, 'participants.user': userId })
    .populate('participants.user', 'firstName lastName profilePicture')
    .populate('lastMessage')
    .exec();

  if (!chat) return res.status(404).json({ error: 'Chat not found' });

  return res.status(200).json(chat);
};

export const createChat = async (req, res) => {
  const userId = getSubFromJwt(req.auth);

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { firstName, lastName } = req.body;

  try {
    const chat = await Chat.create({
      participants: [{ user: userId }],
      chatType: 'AutoResponse',
      virtualUser: {
        firstName: firstName,
        lastName: lastName,
        profilePicture: `https://api.dicebear.com/9.x/bottts/svg?seed=${firstName}-${lastName}`,
      },
    });

    return res.status(201).json(chat);
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, details: error.errors });
  }
};

export const updateChat = async (req, res) => {
  const userId = getSubFromJwt(req.auth);

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const chatId = req.params.chatId;

  const chat = await Chat.findOne({ _id: chatId, 'participants.user': userId })
    .populate('participants.user', 'firstName lastName profilePicture')
    .populate('lastMessage')
    .exec();

  if (!chat) return res.status(404).json({ error: 'Chat not found' });

  const { firstName, lastName, name } = req.body;

  if (chat.chatType === 'AutoResponse') {
    chat.virtualUser.firstName = firstName;
    chat.virtualUser.lastName = lastName;
  } else if (chat.chatType === 'Group') {
    chat.name = name;
  }

  try {
    await chat.save();
    return res.status(200).json(chat);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: error.errors });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteChat = async (req, res) => {
  const userId = getSubFromJwt(req.auth);

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const chatId = req.params.chatId;

  const result = await Chat.deleteOne({
    _id: chatId,
    'participants.user': userId,
  }).exec();

  return result.deletedCount === 0
    ? res.status(404).json({ error: 'Chat not found', details: error.errors })
    : res.status(204).json({ message: 'Chat has been successfully deleted' });
};
