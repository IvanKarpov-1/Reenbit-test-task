import express from 'express';
import { generatePredefinedUsers } from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/users/predefine', generatePredefinedUsers);

export default router;
