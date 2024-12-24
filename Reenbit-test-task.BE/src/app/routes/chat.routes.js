import express from 'express';
import {
  createChat,
  getChat,
  getChats,
} from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/', getChats);
router.get('/:chatId', getChat);
router.post('/', createChat);
router.put('/:chatId', () => {});
router.delete('/:chatId', () => {});

export default router;
