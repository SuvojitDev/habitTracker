const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  totalXP: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  achievements: [{
    id: String,
    name: String,
    unlockedAt: { type: Date, default: Date.now }
  }],
  stats: {
    totalHabitsCompleted: { type: Number, default: 0 },
    longestOverallStreak: { type: Number, default: 0 },
    perfectWeeks: { type: Number, default: 0 }
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  }],
  powerUps: [{
    type: { type: String, enum: ['xp_boost', 'streak_freeze', 'double_xp'] },
    quantity: { type: Number, default: 0 },
    expiresAt: { type: Date }
  }],
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true }
    },
    privacy: {
      showProfile: { type: Boolean, default: true },
      showStats: { type: Boolean, default: true }
    }
  },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  versionKey: false
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.addPowerUp = function(type, quantity = 1, duration = 24) {
  const existing = this.powerUps.find(p => p.type === type);
  if (existing) {
    existing.quantity += quantity;
  } else {
    this.powerUps.push({
      type,
      quantity,
      expiresAt: new Date(Date.now() + duration * 60 * 60 * 1000)
    });
  }
};

userSchema.methods.usePowerUp = function(type) {
  const powerUp = this.powerUps.find(p => p.type === type && p.quantity > 0);
  if (powerUp) {
    powerUp.quantity -= 1;
    return true;
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);