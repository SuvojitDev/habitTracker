const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { type: String, required: true, trim: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  targetFrequency: { type: Number, default: 1 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastCompletedDate: { type: Date },
  completions: [{
    date: { type: Date, default: Date.now },
    xpEarned: { type: Number, default: 10 },
    bonusMultiplier: { type: Number, default: 1 },
    note: { type: String },
    photo: { type: String },
    mood: { type: String, enum: ['great', 'good', 'okay', 'difficult'] }
  }],
  reminders: [{
    time: { type: String },
    days: [{ type: Number, min: 0, max: 6 }],
    isActive: { type: Boolean, default: true }
  }],
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Habit' }],
  theme: {
    color: { type: String, default: '#8B5CF6' },
    icon: { type: String, default: '🎯' }
  },
  analytics: {
    successRate: { type: Number, default: 0 },
    bestTimeOfDay: { type: String },
    averageCompletionTime: { type: Number }
  },
  isTemplate: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  versionKey: false
});

habitSchema.methods.getDifficultyMultiplier = function() {
  const multipliers = { easy: 1, medium: 1.5, hard: 2 };
  return multipliers[this.difficulty] || 1;
};

habitSchema.methods.updateAnalytics = function() {
  if (this.completions.length === 0) return;
  
  const totalDays = Math.ceil((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
  this.analytics.successRate = (this.completions.length / totalDays) * 100;
  
  const hourCounts = {};
  this.completions.forEach(completion => {
    const hour = new Date(completion.date).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  const bestHour = Object.keys(hourCounts).reduce((a, b) => 
    hourCounts[a] > hourCounts[b] ? a : b
  );
  
  if (bestHour < 12) this.analytics.bestTimeOfDay = 'morning';
  else if (bestHour < 17) this.analytics.bestTimeOfDay = 'afternoon';
  else this.analytics.bestTimeOfDay = 'evening';
};

habitSchema.methods.canComplete = function() {
  if (!this.dependencies.length) return true;
  
  const today = new Date().toDateString();
  return this.dependencies.every(depId => {
    const dep = this.parent().habits.id(depId);
    return dep && dep.lastCompletedDate && 
           new Date(dep.lastCompletedDate).toDateString() === today;
  });
};

module.exports = mongoose.model('Habit', habitSchema);