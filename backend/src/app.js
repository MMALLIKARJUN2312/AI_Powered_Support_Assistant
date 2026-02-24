import express from 'express';
import cors from 'cors';
import chatRoutes from "./routes/chatRoutes.js"
import rateLimiter from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "*"
}));

app.use(express.json())

app.use(rateLimiter);

app.use("/api", chatRoutes);

app.use(errorHandler);

export default app;