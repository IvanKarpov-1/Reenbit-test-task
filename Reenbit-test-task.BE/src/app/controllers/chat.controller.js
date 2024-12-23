import { getSubFromJwt } from '../utils/getSubFromJwt.js';
import Chat from '../models/chat.model.js';

export const getChats = async (req, res) => {
  const userId = getSubFromJwt(req.auth);

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const chats = await Chat.find({
    $or: [{ user1: userId }, { user2: userId }],
  })
    .populate('user1')
    .populate('user2')
    .populate('lastMessage');

  return res.status(200).json(chats);
};
