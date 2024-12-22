import express from 'express';
import userRoutes from './user.routes.js';

const router = express.Router();

router.get('/', function (req, res) {
  res.status(200).send('Everything works');
});

router.use('/users', userRoutes);

export default router;
