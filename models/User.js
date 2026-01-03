import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    timeTaken: { type: Number, required: true }, // Store in seconds
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);