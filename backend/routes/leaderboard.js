import express from 'express';
import Workout from '../models/Workout.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

// Global leaderboard: sums calories across all users and ranks them
router.get('/leaderboard', async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: '$userId',
          totalCalories: { $sum: '$caloriesBurned' },
          workoutsCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          totalCalories: 1,
          workoutsCount: 1,
          name: { $ifNull: ['$user.name', 'Anonymous'] },
          avatarUrl: { $ifNull: ['$user.avatarUrl', ''] },
        },
      },
      { $sort: { totalCalories: -1 } },
    ];

    const results = await Workout.aggregate(pipeline);
    const leaderboard = results.map((r, i) => ({
      userId: r.userId?.toString?.() || r.userId,
      name: r.name,
      avatarUrl: r.avatarUrl,
      totalCalories: r.totalCalories || 0,
      workoutsCount: r.workoutsCount || 0,
      rank: i + 1,
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public (auth required) view of a user's workouts for leaderboard detail
router.get('/leaderboard/:userId/workouts', authRequired, async (req, res) => {
  try {
    const { userId } = req.params;
    const workouts = await Workout.find({ userId })
      .sort({ date: -1 })
      .limit(50)
      .select('type duration caloriesBurned date');

    res.json(workouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
