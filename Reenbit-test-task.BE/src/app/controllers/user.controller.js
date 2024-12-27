import User from '../models/user.model.js';
import { getSubFromJwt } from '../utils/getSubFromJwt.js';
import Chat from '../models/chat.model.js';

export const loginUser = async (req, res) => {
  try {
    const userId = getSubFromJwt(req.auth);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { firstName, lastName, profilePicture, updatedAt } = req.body;

    let user = await User.findById(userId).populate('settings');

    if (user) {
      user.lastLogin = Date.now();

      if (user.updatedAt !== updatedAt) {
        user.firstName = firstName;
        user.lastName = lastName;
        user.profilePicture = profilePicture;
      }

      await user.save();
      return res.status(200).json(user);
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

      return res.status(201).json(user);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const changeUserSettings = async (req, res) => {
  const userId = getSubFromJwt(req.auth);

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { settingName, value } = req.body;

  let user = await User.findById(userId);

  const allowedSettings = ['isSendRandomAutomaticMessages'];

  if (!allowedSettings.includes(settingName)) {
    return res.status(400).json({ error: 'Invalid setting name' });
  }

  if (user.settings[settingName] !== value) {
    user.settings[settingName] = value;
  }

  await user.save();
  return res.status(200).json({ message: 'User settings updated' });
};

const createPredefinedChats = async (userId) => {
  const chat1 = Chat.create({
    participants: [{ user: userId }],
    chatType: 'AutoResponse',
    virtualUser: {
      firstName: 'Alice',
      lastName: 'Freeman',
      profilePicture:
        'https://api.dicebear.com/9.x/bottts/svg?seed=Alice-Freeman',
    },
  });

  const chat2 = Chat.create({
    participants: [{ user: userId }],
    chatType: 'AutoResponse',
    virtualUser: {
      firstName: 'Arthur',
      lastName: 'Leywin',
      profilePicture:
        'https://api.dicebear.com/9.x/bottts/svg?seed=Arthur-Leywin',
    },
  });

  const chat3 = Chat.create({
    participants: [{ user: userId }],
    chatType: 'AutoResponse',
    virtualUser: {
      firstName: 'Caera',
      lastName: 'Denoir',
      profilePicture:
        'https://api.dicebear.com/9.x/bottts/svg?seed=Caera-Denoir',
    },
  });

  await Promise.all([chat1, chat2, chat3]);
};
