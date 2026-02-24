import dotenv from 'dotenv';
import app from './app.js';
import initializeDb from './config/initializeDb.js';
import { initializeGemini } from './services/geminiService.js';

dotenv.config();

initializeDb();

initializeGemini(process.env.GEMINI_API_KEY)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on the port ${PORT}`);
})