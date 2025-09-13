const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  icon: { type: String, default: '🏆' },
  xpReward: { type: Number, default: 50 },
  condition: {
    type: { type: String, required: true }, // 'streak', 'total_completions', 'perfect_week', etc.
    value: { type: Number, required: true }
  },
  rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Achievement', achievementSchema);