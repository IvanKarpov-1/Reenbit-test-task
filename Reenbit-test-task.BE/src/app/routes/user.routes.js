import express from 'express';
import {
  changeUserSettings,
  loginUser,
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/login', loginUser);
router.put('/settings', changeUserSettings);

export default router;
