import express from 'express';
import {
  createAutoResponseMessage,
  createMessage,
  deleteMessage,
  getMessages,
  updateMessage,
} from '../controllers/message.controller.js';

const router = express.Router();

router.get('/chat/:chatId', getMessages);
router.post('/chat/:chatId', createMessage);
router.post('/chat/:chatId/auto-response', createAutoResponseMessage);
router.put('/:messageId', updateMessage);
router.delete('/:messageId', deleteMessage);

export default router;
