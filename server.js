import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Question from './models/Question.js';
import User from './models/User.js';

dotenv.config();

const app = express();

// Important for Vercel: Middleware
app.use(cors());
app.use(express.json());

// 1. Get a random Python question
app.get('/api/question', async (req, res) => {
    try {
        await connectDB(); // Ensure DB is connected for this specific request
        const count = await Question.countDocuments();
        if (count === 0) return res.status(404).json({ error: "No questions found. Seed the DB!" });
        
        const random = Math.floor(Math.random() * count);
        const question = await Question.findOne().skip(random);
        res.json(question);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch question" });
    }
});

// 2. Save the final result (Aligned endpoint with frontend)
app.post('/api/save-score', async (req, res) => {
    try {
        await connectDB(); 
        const { username, timeTaken } = req.body;
        
        if (!username || timeTaken === undefined) {
            return res.status(400).json({ error: "Missing username or timeTaken" });
        }

        const newRecord = await User.create({ username, timeTaken });
        res.status(201).json(newRecord);
    } catch (err) {
        res.status(500).json({ error: "Failed to save record" });
    }
});

// 3. Health Check (Good for testing deployment)
app.get('/api/health', (req, res) => res.send("System Online"));

// Export for Vercel
export default app;

// Local development support
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`🚀 Local server running on port ${PORT}`));
}