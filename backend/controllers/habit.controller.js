const Habit = require('../models/Habit');
const User = require('../models/User');
const { calculateXP, calculateLevel, updateStreak, getBonusMultiplier } = require('../utils/points');
const { checkAchievements } = require('../utils/achievements');

const createHabit = async (req, res) => {
  try {
    const habit = new Habit({ ...req.body, userId: req.user._id });
    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id, isActive: true });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const completeHabit = async (req, res) => {
  try {
    const { note, photo, mood } = req.body;
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    if (!habit.canComplete()) {
      return res.status(400).json({ message: 'Complete dependent habits first' });
    }

    const currentDate = new Date();
    const streakUpdate = updateStreak(habit.lastCompletedDate, currentDate);
    
    if (streakUpdate.alreadyCompleted) {
      return res.status(400).json({ message: 'Habit already completed today' });
    }

    if (streakUpdate.increment) {
      habit.currentStreak += 1;
    } else if (streakUpdate.newStreak !== null) {
      habit.currentStreak = streakUpdate.newStreak;
    }
    
    habit.longestStreak = Math.max(habit.longestStreak, habit.currentStreak);
    habit.lastCompletedDate = currentDate;
    
    const user = await User.findById(req.user._id);
    let bonusMultiplier = getBonusMultiplier(currentDate.getDay(), habit.currentStreak);
    
    // Check for power-ups
    if (user.usePowerUp('double_xp')) {
      bonusMultiplier *= 2;
    }
    
    const xpEarned = calculateXP(habit.currentStreak, habit.difficulty, bonusMultiplier);
    
    habit.completions.push({ 
      xpEarned, 
      bonusMultiplier, 
      note, 
      photo, 
      mood 
    });
    
    habit.updateAnalytics();
    await habit.save();

    user.totalXP += xpEarned;
    user.level = calculateLevel(user.totalXP);
    user.stats.totalHabitsCompleted += 1;
    user.stats.longestOverallStreak = Math.max(user.stats.longestOverallStreak, habit.currentStreak);
    
    if (habit.currentStreak % 7 === 0 && habit.currentStreak > 0) {
      user.stats.perfectWeeks += 1;
    }
    
    await user.save();

    const newAchievements = await checkAchievements(req.user._id, {
      totalCompletions: user.stats.totalHabitsCompleted,
      currentStreak: habit.currentStreak,
      perfectWeeks: user.stats.perfectWeeks
    });

    res.json({ 
      habit, 
      xpEarned, 
      bonusMultiplier,
      newLevel: user.level,
      achievements: newAchievements,
      streakBroken: streakUpdate.streakBroken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Calculate XP to subtract
    const xpToSubtract = habit.completions.reduce((total, completion) => total + completion.xpEarned, 0);
    
    // Update habit to inactive
    habit.isActive = false;
    await habit.save();

    // Update user stats
    const user = await User.findById(req.user._id);
    user.totalXP = Math.max(0, user.totalXP - xpToSubtract);
    user.level = Math.floor(Math.sqrt(user.totalXP / 50)) + 1;
    user.stats.totalHabitsCompleted = Math.max(0, user.stats.totalHabitsCompleted - habit.completions.length);
    await user.save();

    res.json({ message: 'Habit deleted', xpLost: xpToSubtract });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getHabitTemplates = async (req, res) => {
  try {
    const templates = await Habit.find({ isTemplate: true, isPublic: true })
      .select('name description category difficulty theme')
      .limit(20);
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getHabitAnalytics = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const analytics = {
      successRate: habit.analytics.successRate,
      bestTimeOfDay: habit.analytics.bestTimeOfDay,
      completionTrend: habit.completions.slice(-30).map(c => ({
        date: c.date,
        xp: c.xpEarned,
        mood: c.mood
      })),
      streakHistory: {
        current: habit.currentStreak,
        longest: habit.longestStreak,
        average: habit.completions.length > 0 ? habit.completions.length / Math.ceil((Date.now() - habit.createdAt) / (1000 * 60 * 60 * 24)) : 0
      }
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createHabit, getHabits, completeHabit, deleteHabit, getHabitTemplates, getHabitAnalytics };