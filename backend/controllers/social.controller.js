const User = require('../models/User');
const HabitGroup = require('../models/HabitGroup');

const sendFriendRequest = async (req, res) => {
  try {
    const { username } = req.body;
    const targetUser = await User.findOne({ username });
    
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    const existingRequest = targetUser.friendRequests.find(
      r => r.from.toString() === req.user._id.toString()
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    targetUser.friendRequests.push({ from: req.user._id });
    await targetUser.save();

    res.json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const respondToFriendRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;
    const user = await User.findById(req.user._id);
    
    const request = user.friendRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (action === 'accept') {
      user.friends.push(request.from);
      const friend = await User.findById(request.from);
      friend.friends.push(user._id);
      await friend.save();
    }

    user.friendRequests.pull(requestId);
    await user.save();

    res.json({ message: `Friend request ${action}ed` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'username level totalXP')
      .populate('friendRequests.from', 'username');
    
    res.json({
      friends: user.friends,
      pendingRequests: user.friendRequests
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createHabitGroup = async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;
    
    const group = new HabitGroup({
      name,
      description,
      createdBy: req.user._id,
      isPrivate,
      members: [{ userId: req.user._id, role: 'admin' }]
    });

    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const joinHabitGroup = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const group = await HabitGroup.findOne({ inviteCode });
    
    if (!group) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    const isMember = group.members.some(m => m.userId.toString() === req.user._id.toString());
    if (isMember) {
      return res.status(400).json({ message: 'Already a member of this group' });
    }

    group.members.push({ userId: req.user._id });
    await group.save();

    res.json({ message: 'Joined group successfully', group });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { 
  sendFriendRequest, 
  respondToFriendRequest, 
  getFriends, 
  createHabitGroup, 
  joinHabitGroup 
};