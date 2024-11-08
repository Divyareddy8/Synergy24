import express, { json } from 'express';
import { config } from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';

config();
connectDB();

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import gamificationRoutes from './routes/gamificationRoutes.js';

const app = express();

app.use(json());
app.use(cors());

console.log('Server is starting...');

// Root route
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.json({ message: 'Welcome to the API' });
});

// Auth route with debug logs
app.use('/api/auth', (req, res, next) => {
  console.log(`Auth route accessed with method: ${req.method} and path: ${req.path}`);
  next();
}, authRoutes);

// Additional routes with debug logs
app.use('/api/users', (req, res, next) => {
  console.log(`Users route accessed with method: ${req.method} and path: ${req.path}`);
  next();
}, userRoutes);

app.use('/api/lessons', (req, res, next) => {
  console.log(`Lessons route accessed with method: ${req.method} and path: ${req.path}`);
  next();
}, lessonRoutes);

app.use('/api/gamification', (req, res, next) => {
  console.log(`Gamification route accessed with method: ${req.method} and path: ${req.path}`);
  next();
}, gamificationRoutes);

// Handle undefined routes
app.use((req, res) => {
  console.log(`Undefined route accessed: ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit(0);
});
