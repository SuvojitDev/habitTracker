const calculateXP = (streak, difficulty = 'medium', bonusMultiplier = 1) => {
  const baseXP = { easy: 8, medium: 10, hard: 15 }[difficulty] || 10;
  const streakBonus = Math.floor(streak / 7) * 5;
  const perfectWeekBonus = streak % 7 === 0 && streak > 0 ? 20 : 0;
  return Math.floor((baseXP + streakBonus + perfectWeekBonus) * bonusMultiplier);
};

const calculateLevel = (totalXP) => {
  // Progressive leveling: each level requires more XP
  return Math.floor(Math.sqrt(totalXP / 50)) + 1;
};

const updateStreak = (lastCompletedDate, currentDate = new Date()) => {
  if (!lastCompletedDate) return { newStreak: 1, streakBroken: false };
  
  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const lastDate = new Date(lastCompletedDate);
  const isConsecutive = lastDate.toDateString() === yesterday.toDateString();
  const isSameDay = lastDate.toDateString() === currentDate.toDateString();
  
  if (isSameDay) return { newStreak: null, streakBroken: false, alreadyCompleted: true };
  if (isConsecutive) return { newStreak: null, streakBroken: false, increment: true };
  
  return { newStreak: 1, streakBroken: true };
};

const getBonusMultiplier = (dayOfWeek, streak) => {
  let multiplier = 1;
  if ([0, 6].includes(dayOfWeek)) multiplier += 0.2; // Weekend bonus
  if (streak >= 30) multiplier += 0.5; // Long streak bonus
  return multiplier;
};

module.exports = { calculateXP, calculateLevel, updateStreak, getBonusMultiplier };