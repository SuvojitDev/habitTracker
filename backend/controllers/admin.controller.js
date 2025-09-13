const Admin = require('../models/Admin');
const User = require('../models/User');
const Habit = require('../models/Habit');
const Challenge = require('../models/Challenge');
const Achievement = require('../models/Achievement');
const jwt = require('jsonwebtoken');

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email, isActive: true });
    
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { adminId: admin._id, role: admin.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '8h' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [userCount, habitCount, challengeCount, achievementCount] = await Promise.all([
      User.countDocuments(),
      Habit.countDocuments({ isActive: true }),
      Challenge.countDocuments({ isActive: true }),
      Achievement.countDocuments()
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email totalXP level createdAt');

    const topUsers = await User.find()
      .sort({ totalXP: -1 })
      .limit(5)
      .select('username totalXP level');

    res.json({
      stats: { userCount, habitCount, challengeCount, achievementCount },
      recentUsers,
      topUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const query = search ? {
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(query)
      .select('username email totalXP level createdAt stats')
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getHabits = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category || '';

    const query = {
      ...(search && { name: { $regex: search, $options: 'i' } }),
      ...(category && { category })
    };

    const habits = await Habit.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Habit.countDocuments(query);

    res.json({
      habits,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Delete user's habits
    await Habit.deleteMany({ userId });
    
    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const clearAllData = async (req, res) => {
  try {
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ message: 'Super admin access required' });
    }

    await Promise.all([
      User.deleteMany({}),
      Habit.deleteMany({}),
      Challenge.deleteMany({}),
      // Keep achievements as they're system-wide
    ]);

    res.json({ message: 'All data cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUserXP = async (req, res) => {
  try {
    const { userId } = req.params;
    const { totalXP } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.totalXP = totalXP;
    user.level = Math.floor(Math.sqrt(totalXP / 50)) + 1;
    await user.save();

    res.json({ message: 'User XP updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getSystemAnalytics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const analytics = await Promise.all([
      // User growth
      User.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
      ]),
      
      // Habit completions
      Habit.aggregate([
        { $unwind: "$completions" },
        { $match: { "completions.date": { $gte: thirtyDaysAgo } } },
        { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$completions.date" } },
          count: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
      ]),

      // Category distribution
      Habit.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      userGrowth: analytics[0],
      habitCompletions: analytics[1],
      categoryDistribution: analytics[2]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  adminLogin,
  getDashboardStats,
  getUsers,
  getHabits,
  deleteUser,
  clearAllData,
  updateUserXP,
  getSystemAnalytics
};