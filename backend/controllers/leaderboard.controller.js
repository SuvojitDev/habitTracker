const User = require('../models/User');

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({}, 'username totalXP level')
      .lean()
      .sort({ totalXP: -1 })
      .limit(10);
    
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      totalXP: user.totalXP,
      level: user.level,
      userId: user._id
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserRank = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ totalXP: { $gt: req.user.totalXP } });
    const rank = userCount + 1;
    
    res.json({ 
      rank, 
      totalXP: req.user.totalXP, 
      level: req.user.level 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getLeaderboard, getUserRank };