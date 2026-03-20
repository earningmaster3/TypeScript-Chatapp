import express, { Request, Response } from 'express';
import { protectedRoute } from '../middlewares/protectedRoute';
import { sendMessages, getMessages, getUsers } from '../controllers/messageControllers';

const router = express.Router();

router.post("/send/:id", protectedRoute, sendMessages);
router.get("/get/:id", protectedRoute, getMessages);
router.get("/users", protectedRoute, getUsers)

export default router;