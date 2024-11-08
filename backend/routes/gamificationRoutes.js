import express from 'express';
import { updatePoints, getRewards, getLeaderboard } from '../controllers/gamificationController.js';

const router = express.Router();

// Define routes
router.post('/updatePoints', updatePoints);  // Route for updating user points
router.get('/getRewards', getRewards);       // Route for fetching rewards based on points
router.get('/leaderboard', getLeaderboard);  // Route for retrieving the leaderboard

export default router;  // Export the router
