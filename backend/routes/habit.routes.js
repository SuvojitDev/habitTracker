const express = require('express');
const { createHabit, getHabits, completeHabit, deleteHabit, getHabitTemplates, getHabitAnalytics } = require('../controllers/habit.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/create', createHabit);
router.get('/list', getHabits);
router.get('/templates', getHabitTemplates);
router.get('/:id/analytics', getHabitAnalytics);
router.post('/:id/complete', completeHabit);
router.delete('/:id', deleteHabit);

module.exports = router;