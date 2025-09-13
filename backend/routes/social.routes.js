const express = require('express');
const { 
  sendFriendRequest, 
  respondToFriendRequest, 
  getFriends, 
  createHabitGroup, 
  joinHabitGroup 
} = require('../controllers/social.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/friend-request', sendFriendRequest);
router.post('/friend-request/respond', respondToFriendRequest);
router.get('/friends', getFriends);
router.post('/groups', createHabitGroup);
router.post('/groups/join', joinHabitGroup);

module.exports = router;