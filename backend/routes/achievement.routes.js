const express = require('express');
const Achievement = require('../models/Achievement');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/list', async (req, res) => {
  try {
    const achievements = await Achievement.find({});
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/user', async (req, res) => {
  try {
    const user = await req.user.populate('achievements');
    res.json(user.achievements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;