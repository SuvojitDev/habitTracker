const Challenge = require('../models/Challenge');
const User = require('../models/User');

const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true })
      .populate('participants', 'username level')
      .sort({ createdAt: -1 });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    if (!challenge.participants.includes(req.user._id)) {
      challenge.participants.push(req.user._id);
      await challenge.save();
    }

    res.json({ message: 'Joined challenge successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const completeChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const alreadyCompleted = challenge.completions.some(
      c => c.userId.toString() === req.user._id.toString()
    );

    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Challenge already completed' });
    }

    challenge.completions.push({ userId: req.user._id });
    await challenge.save();

    const user = await User.findById(req.user._id);
    user.totalXP += challenge.xpReward;
    await user.save();

    res.json({ message: 'Challenge completed!', xpEarned: challenge.xpReward });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createDailyChallenges = async () => {
  const dailyChallenges = [
    {
      title: 'Early Bird',
      description: 'Complete a habit before 8 AM',
      category: 'productivity',
      xpReward: 25
    },
    {
      title: 'Consistency King',
      description: 'Complete 3 different habits today',
      category: 'general',
      xpReward: 50
    },
    {
      title: 'Weekend Warrior',
      description: 'Complete any habit on weekend',
      category: 'motivation',
      xpReward: 30
    }
  ];

  for (const challengeData of dailyChallenges) {
    const existing = await Challenge.findOne({
      title: challengeData.title,
      startDate: { $gte: new Date().setHours(0, 0, 0, 0) }
    });

    if (!existing) {
      const challenge = new Challenge({
        ...challengeData,
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
      await challenge.save();
    }
  }
};

module.exports = { getChallenges, joinChallenge, completeChallenge, createDailyChallenges };