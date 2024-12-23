import express from 'express';
import userRoutes from './user.routes.js';
import chatRoutes from './chat.routes.js';
import adminRoutes from './admin.routes.js';

const router = express.Router();

router.get('/', function (req, res) {
  res.status(200).send('Everything works');
});

router.use('/users', userRoutes);
router.use('/chats', chatRoutes);

export default router;
