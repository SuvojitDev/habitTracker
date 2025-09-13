const express = require('express');
const { getLeaderboard, getUserRank } = require('../controllers/leaderboard.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { cacheMiddleware } = require('../utils/cache');

const router = express.Router();

router.use(authMiddleware);

router.get('/top', cacheMiddleware(300), getLeaderboard);
router.get('/rank', getUserRank);

module.exports = router;