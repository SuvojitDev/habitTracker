require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

// Middleware
app.use(compression());
app.use(limiter);
app.use(cors());
app.use(express.json());

// Database
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
  .then(async () => {
    console.log('MongoDB Atlas connected');
    
    // Create database indexes (skip if already exist)
    const User = require('./models/User');
    const Habit = require('./models/Habit');
    
    try {
      await User.collection.createIndex({ totalXP: -1 });
      await Habit.collection.createIndex({ userId: 1, isActive: 1 });
      await Habit.collection.createIndex({ createdAt: -1 });
      console.log('Database indexes created');
    } catch (error) {
      if (error.code === 86) {
        console.log('Indexes already exist, skipping creation');
      } else {
        console.error('Index creation error:', error.message);
      }
    }
    
    // Initialize achievements
    const { initializeAchievements } = require('./utils/achievements');
    await initializeAchievements();
    console.log('Achievements initialized');
    
    // Create daily challenges
    const { createDailyChallenges } = require('./controllers/challenge.controller');
    await createDailyChallenges();
    console.log('Daily challenges created');
  })
  .catch(err => console.error('DB Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/habits', require('./routes/habit.routes'));
app.use('/api/leaderboard', require('./routes/leaderboard.routes'));
app.use('/api/achievements', require('./routes/achievement.routes'));
app.use('/api/challenges', require('./routes/challenge.routes'));
app.use('/api/social', require('./routes/social.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Server Error' 
  });
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// MongoDB connection error handling
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});