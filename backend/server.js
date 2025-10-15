import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import workoutRoutes from './routes/workout.js';
import leaderboardRoutes from './routes/leaderboard.js';
import intakeRoutes from './routes/intake.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS configuration for production
const allowedOrigins = [
  'https://burnmate-exclusive.vercel.app',
  'http://localhost:8080',
  'http://localhost:5173'
];

const io = new SocketIO(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
  // Example: socket.on('message', (msg) => { io.emit('message', msg); });
});

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// DB
await connectDB();

// Routes
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', workoutRoutes);
app.use('/api', leaderboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});


