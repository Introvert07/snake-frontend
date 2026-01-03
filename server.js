import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Question from './models/Question.js';
import User from './models/User.js';

dotenv.config();

const app = express();

// --- DATABASE CONNECTION ---
// Connect once at startup
connectDB();

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  'https://snake-frontend-h68j.vercel.app', // Your specific frontend
  'https://snake-frontend-rust.vercel.app', // Your other Vercel frontend
  'http://localhost:5173',                  // Local development
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy: This origin is not allowed'), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// --- ROUTES ---

// 1. Get a random Python question
app.get('/api/question', async (req, res) => {
    try {
        const count = await Question.countDocuments();
        if (count === 0) return res.status(404).json({ error: "No questions found." });
        
        const random = Math.floor(Math.random() * count);
        const question = await Question.findOne().skip(random);
        res.json(question);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch question" });
    }
});

// 2. Save score
app.post('/api/save-score', async (req, res) => {
    try {
        const { username, timeTaken } = req.body;
        
        if (!username || timeTaken === undefined) {
            return res.status(400).json({ error: "Missing data" });
        }

        const newRecord = await User.create({ username, timeTaken });
        res.status(201).json(newRecord);
    } catch (err) {
        res.status(500).json({ error: "Failed to save record" });
    }
});

// 3. Health Check
app.get('/api/health', (req, res) => res.status(200).json({ status: "System Online" }));

// --- SERVER INITIALIZATION ---
// Render/Heroku/Railway use process.env.PORT
const PORT = process.env.PORT || 4000;

// This must run on Render to avoid 'Port scan timeout'
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Export for Vercel compatibility
export default app;