import express from 'express';
import User from '../models/User.js';
import { authRequired, requireSameUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile/:id', authRequired, requireSameUser('id'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const payload = { id: user._id.toString(), name: user.name, email: user.email, age: user.age, gender: user.gender, bio: user.bio, avatarUrl: user.avatarUrl };
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile/:id', authRequired, requireSameUser('id'), async (req, res) => {
  try {
    const { bio, avatarUrl, name, age, gender } = req.body;
    const update = { bio, avatarUrl, name, age, gender };
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const payload = { id: user._id.toString(), name: user.name, email: user.email, age: user.age, gender: user.gender, bio: user.bio, avatarUrl: user.avatarUrl };
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;


