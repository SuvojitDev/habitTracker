const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['achievement', 'streak', 'challenge', 'reminder', 'social'], 
    required: true 
  },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  data: { type: mongoose.Schema.Types.Mixed },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Notification', notificationSchema);