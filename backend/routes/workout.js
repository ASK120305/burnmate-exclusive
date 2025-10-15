import express from 'express';
import Workout from '../models/Workout.js';
import { authRequired, requireSameUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/workout', authRequired, async (req, res) => {
  try {
    const { type, duration, caloriesBurned, date } = req.body;
    const workout = await Workout.create({
      userId: req.user.id,
      type,
      duration,
      caloriesBurned,
      date: date ? new Date(date) : new Date(),
    });
    res.status(201).json(workout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/workouts/:userId', authRequired, requireSameUser('userId'), async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;


