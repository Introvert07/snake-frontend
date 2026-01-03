import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Question from './models/Question.js';
import User from './models/User.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Get a random Python question when player hits a snake
app.get('/api/question', async (req, res) => {
    try {
        const count = await Question.countDocuments();
        const random = Math.floor(Math.random() * count);
        const question = await Question.findOne().skip(random);
        res.json(question);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch question" });
    }
});

// 2. Save the final result (Name + Time)
app.post('/api/save-game', async (req, res) => {
    try {
        const { username, timeTaken } = req.body;
        const newRecord = await User.create({ username, timeTaken });
        res.status(201).json(newRecord);
    } catch (err) {
        res.status(500).json({ error: "Failed to save record" });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));