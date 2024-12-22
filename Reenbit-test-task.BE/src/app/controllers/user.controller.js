import User from '../models/user.model.js';
import { getSubFromJwt } from '../utils/getSubFromJwt.js';

export const loginUser = async (req, res) => {
  try {
    const userId = getSubFromJwt(req.auth);

    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    let user = await User.findById(userId);

    if (user) {
      user.lastLogin = Date.now();
      await user.save();
      return res.status(200).json({ message: 'User login updated' });
    } else {
      await User.create({
        _id: userId,
        lastLogin: Date.now(),
      });
      return res.status(201).json({ message: 'User created' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
