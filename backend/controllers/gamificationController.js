import User from '../models/User.js'; // Import the User model

// Update points for a user after completing a lesson
export async function updatePoints(req, res) {
  const { userId, points } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.points += points;
    await user.save();
    res.json({ message: 'Points updated', totalPoints: user.points });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating points' });
  }
}

// Fetch rewards based on points
export async function getRewards(req, res) {
  try {
    const user = await User.findById(req.user.id);  // Ensure req.user is set by authentication middleware
    if (!user) return res.status(404).json({ message: 'User not found' });

    const rewards = calculateRewards(user.points);
    user.rewards = rewards;
    await user.save();

    res.json({ rewards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching rewards' });
  }
}

// Retrieve leaderboard (top users by points)
export async function getLeaderboard(_, res) {
  try {
    // Fetch the top 10 users sorted by points in descending order, selecting only 'username' and 'points'
    const leaderboard = await User.find({}).sort({ points: -1 }).limit(10).select('username points');
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching leaderboard' });
  }
}

// Helper function to determine rewards based on points
function calculateRewards(points) {
  const rewards = [];
  if (points >= 100) rewards.push('Bronze Badge');
  if (points >= 500) rewards.push('Silver Badge');
  if (points >= 1000) rewards.push('Gold Badge');
  // Add more rewards as needed
  return rewards;
}
