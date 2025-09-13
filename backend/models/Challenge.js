const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  type: { type: String, enum: ['daily', 'weekly', 'seasonal'], default: 'daily' },
  category: { type: String, required: true },
  xpReward: { type: Number, default: 50 },
  requirements: {
    count: { type: Number, default: 1 },
    timeframe: { type: String, enum: ['day', 'week', 'month'], default: 'day' }
  },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  completions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Challenge', challengeSchema);