import User from '../models/user.model.js';
import { getSubFromJwt } from '../utils/getSubFromJwt.js';
import Chat from '../models/chat.model.js';

export const loginUser = async (req, res) => {
  try {
    const userId = getSubFromJwt(req.auth);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { firstName, lastName, profilePicture, updatedAt } = req.body;

    let user = await User.findById(userId);

    if (user) {
      user.lastLogin = Date.now();

      if (user.updatedAt !== updatedAt) {
        user.firstName = firstName;
        user.lastName = lastName;
        user.profilePicture = profilePicture;
      }

      await user.save();
      return res.status(200).json({ message: 'User login updated' });
    } else {
      await User.create({
        _id: userId,
        firstName: firstName,
        lastName: lastName,
        profilePicture: profilePicture,
        updatedAt: updatedAt,
        lastLogin: Date.now(),
      });

      await createPredefinedChats(userId);

      return res.status(201).json({ message: 'User created' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPredefinedChats = async (userId) => {
  const chat1 = Chat.create({
    user1: userId,
    user2: '1',
  });

  const chat2 = Chat.create({
    user1: userId,
    user2: '2',
  });

  const chat3 = Chat.create({
    user1: userId,
    user2: '3',
  });

  await Promise.all([chat1, chat2, chat3]);
};
