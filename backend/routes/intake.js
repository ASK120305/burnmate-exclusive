import express from 'express';
import Intake from '../models/Intake.js';
import { authRequired, requireSameUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Add an intake entry
router.post('/intake', authRequired, async (req, res) => {
  try {
    const { name, calories, protein, timestamp } = req.body;
    const intake = await Intake.create({
      userId: req.user.id,
      name,
      calories,
      protein: protein || 0,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });
    res.status(201).json(intake);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all intake entries for a user (optionally date range)
router.get('/intake/:userId', authRequired, requireSameUser('userId'), async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = { userId: req.params.userId };
    if (from || to) {
      filter.timestamp = {};
      if (from) filter.timestamp.$gte = new Date(from);
      if (to) filter.timestamp.$lte = new Date(to);
    }
    const entries = await Intake.find(filter).sort({ timestamp: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an intake entry
router.delete('/intake/:id', authRequired, async (req, res) => {
  try {
    const intake = await Intake.findById(req.params.id);
    if (!intake) return res.status(404).json({ message: 'Not found' });
    if (intake.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await intake.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
