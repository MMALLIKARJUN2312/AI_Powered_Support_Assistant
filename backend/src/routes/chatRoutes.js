import express from 'express';
import { chatHandler, getConversationHandler, getSessionsHandler } from '../controllers/chatController.js';

const router = express.Router();

// Post chat
router.post("/chat", chatHandler);

// Get conversation by session
router.get("/conversations/:sessionId", getConversationHandler);

// Get all sessions
router.get("/sessions", getSessionsHandler);

export default router;