const express = require('express');
const { getChallenges, joinChallenge, completeChallenge } = require('../controllers/challenge.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/list', getChallenges);
router.post('/:id/join', joinChallenge);
router.post('/:id/complete', completeChallenge);

module.exports = router;