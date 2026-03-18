import express, { Request, Response } from 'express';
import { protectedRoute } from '../middlewares/protectedRoute';
import { sendMessages } from '../controllers/messageControllers';

const router = express.Router();

router.post("/send/:id", protectedRoute, sendMessages);

export default router;