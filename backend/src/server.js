import dotenv from 'dotenv';
import app from './app.js';
import initializeDb from './config/initializeDb.js';

initializeDb();

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on the port ${PORT}`);
})