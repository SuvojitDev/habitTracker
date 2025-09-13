const express = require('express');
const User = require('../models/User');
const Habit = require('../models/Habit');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

// Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = search ? {
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(query)
      .lean()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all habits with pagination
router.get('/habits', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const habits = await Habit.find()
      .lean()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Habit.countDocuments();

    res.json({
      habits,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (userToDelete.isAdmin) {
      return res.status(403).json({ message: 'Cannot delete admin accounts' });
    }
    await Habit.deleteMany({ userId: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user XP
router.put('/users/:id/xp', async (req, res) => {
  try {
    const { totalXP } = req.body;
    const user = await User.findById(req.params.id);
    user.totalXP = totalXP;
    user.level = Math.floor(Math.sqrt(totalXP / 50)) + 1;
    await user.save();
    res.json({ message: 'User XP updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete habit
router.delete('/habits/:id', async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete inactive habits
router.delete('/habits/inactive', async (req, res) => {
  try {
    const result = await Habit.deleteMany({ isActive: false });
    res.json({ message: `${result.deletedCount} inactive habits deleted` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reset all user XP
router.post('/reset-xp', async (req, res) => {
  try {
    await User.updateMany({ isAdmin: { $ne: true } }, { totalXP: 0, level: 1 });
    res.json({ message: 'All user XP reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create daily challenge
router.post('/challenges/create', async (req, res) => {
  try {
    const challenges = [
      { title: 'Complete 3 habits today', description: 'Finish any 3 habits', xpReward: 50 },
      { title: 'Morning routine', description: 'Complete a habit before 10 AM', xpReward: 30 },
      { title: 'Consistency master', description: 'Complete the same habit 3 days in a row', xpReward: 100 }
    ];
    res.json({ message: 'Daily challenges created', challenges });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Export habits data
router.get('/export/habits', async (req, res) => {
  try {
    const habits = await Habit.find().lean().populate('userId', 'username email');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=habits-export.json');
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create achievement
router.post('/achievements/create', async (req, res) => {
  try {
    const { name, description, xpReward } = req.body;
    const achievement = { name, description, xpReward, createdAt: new Date() };
    res.json({ message: 'Achievement created', achievement });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear all data
router.delete('/clear-all', async (req, res) => {
  try {
    await User.deleteMany({ isAdmin: { $ne: true } });
    await Habit.deleteMany({});
    res.json({ message: 'All data cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [userCount, habitCount] = await Promise.all([
      User.countDocuments({ isAdmin: { $ne: true } }),
      Habit.countDocuments({ isActive: true })
    ]);

    res.json({ userCount, habitCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;