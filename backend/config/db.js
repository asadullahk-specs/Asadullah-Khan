const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in environment variables.');
    return;
  }

  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log('✅ MongoDB connected:', mongoose.connection.name);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    throw err;
  }
}

module.exports = { connectDB };
