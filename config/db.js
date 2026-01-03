import mongoose from 'mongoose';

let isConnected = false; 

export const connectDB = async () => {
    // If we are already connected, don't log or connect again
    if (isConnected) {
        return;
    }

    try {
        console.log("Attempting to connect to MongoDB..."); 
        
        const db = await mongoose.connect(process.env.MONGO_URI);
        
        // Update the flag based on the connection state
        isConnected = db.connections[0].readyState;
        
        console.log("✅ MongoDB Connected"); 
    } catch (err) {
        console.error("❌ DB Error:", err.message);
    }
};