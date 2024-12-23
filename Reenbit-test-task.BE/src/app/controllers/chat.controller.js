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
    return res.status(500).json({ error: error.message });
  }
};
