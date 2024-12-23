import express from 'express';
import { createChat, getChats } from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/', getChats);
router.post('/', createChat);
router.put('/:chatId', () => {});
router.delete('/:chatId', () => {});

export default router;
