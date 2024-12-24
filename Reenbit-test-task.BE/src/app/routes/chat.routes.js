import express from 'express';
import {
  createChat,
  deleteChat,
  getChat,
  getChats,
  updateChat,
} from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/', getChats);
router.get('/:chatId', getChat);
router.post('/', createChat);
router.put('/:chatId', updateChat);
router.delete('/:chatId', deleteChat);

export default router;
