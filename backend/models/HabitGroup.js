const mongoose = require('mongoose');

const habitGroupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now },
    role: { type: String, enum: ['admin', 'member'], default: 'member' }
  }],
  habits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Habit' }],
  isPrivate: { type: Boolean, default: false },
  inviteCode: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  versionKey: false
});

habitGroupSchema.pre('save', function(next) {
  if (!this.inviteCode) {
    this.inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('HabitGroup', habitGroupSchema);