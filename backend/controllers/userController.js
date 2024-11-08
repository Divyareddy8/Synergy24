import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';  // Import the User model

export async function registerUser(req, res) {
  try {
    const { username, password, languages, stage } = req.body;
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password and create the user
    const hashedPassword = await hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, languages, stage });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(400).json({ message: error.message });
  }
}

export async function loginUser(req, res) {
  const { username, password } = req.body;
  
  // Validate request body
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateUserProgress(req, res) {
  const { userId, lessonId } = req.body;

  if (!userId || !lessonId) {
    return res.status(400).json({ message: 'User ID and lesson ID are required' });
  }

  try {
    // Find user by ID and update points
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.points += 10;  // Example point increment
    await user.save();
    res.json({ message: 'Progress updated', points: user.points });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
