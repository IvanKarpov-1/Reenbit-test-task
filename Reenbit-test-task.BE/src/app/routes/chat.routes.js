import express from 'express';
import { getChats } from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/', getChats);
router.post('/', () => {});
router.put('/:chatId', () => {});
router.delete('/:chatId', () => {});

export default router;
