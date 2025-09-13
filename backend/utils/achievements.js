const Achievement = require('../models/Achievement');
const User = require('../models/User');

const ACHIEVEMENTS = [
  { id: 'first_habit', name: 'Getting Started', description: 'Complete your first habit', type: 'total_completions', value: 1, xpReward: 25, icon: '🌱' },
  { id: 'week_warrior', name: 'Week Warrior', description: 'Maintain a 7-day streak', type: 'streak', value: 7, xpReward: 100, icon: '⚔️' },
  { id: 'habit_master', name: 'Habit Master', description: 'Complete 100 habits', type: 'total_completions', value: 100, xpReward: 500, icon: '🏆', rarity: 'epic' },
  { id: 'streak_legend', name: 'Streak Legend', description: 'Achieve a 30-day streak', type: 'streak', value: 30, xpReward: 1000, icon: '🔥', rarity: 'legendary' },
  { id: 'perfect_week', name: 'Perfect Week', description: 'Complete all habits for a week', type: 'perfect_week', value: 1, xpReward: 200, icon: '✨', rarity: 'rare' }
];

const initializeAchievements = async () => {
  for (const achievement of ACHIEVEMENTS) {
    await Achievement.findOneAndUpdate(
      { id: achievement.id },
      achievement,
      { upsert: true, new: true }
    );
  }
};

const checkAchievements = async (userId, stats) => {
  const user = await User.findById(userId);
  const unlockedIds = user.achievements.map(a => a.id);
  const newAchievements = [];

  for (const achievement of ACHIEVEMENTS) {
    if (unlockedIds.includes(achievement.id)) continue;

    let unlocked = false;
    switch (achievement.type) {
      case 'total_completions':
        unlocked = stats.totalCompletions >= achievement.value;
        break;
      case 'streak':
        unlocked = stats.currentStreak >= achievement.value;
        break;
      case 'perfect_week':
        unlocked = stats.perfectWeeks >= achievement.value;
        break;
    }

    if (unlocked) {
      user.achievements.push({ id: achievement.id, name: achievement.name });
      user.totalXP += achievement.xpReward;
      newAchievements.push(achievement);
    }
  }

  if (newAchievements.length > 0) {
    await user.save();
  }

  return newAchievements;
};

module.exports = { initializeAchievements, checkAchievements };