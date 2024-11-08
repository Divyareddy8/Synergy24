import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken'; // Change this to default import
import User from '../models/User.js'; // Import User model

// Register a new user
export async function register(req, res) {
  const { username,email, password, languages, stage } = req.body; // Get languages and stage

  // Debug: Log incoming request data
  console.log('Register request received:', { username,email, password, languages, stage });

  // Basic validation
  if (!username ||!email|| !password || !languages || !stage) {
    console.log('Missing required fields:', { username, email,password, languages, stage }); // Debug: Missing fields
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    console.log('Existing user check:', existingUser); // Debug: Check if the user already exists
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);
    console.log('Hashed password:', hashedPassword); // Debug: Log the hashed password

    // Create new user
    const user = new User({ username,email, password: hashedPassword, languages, stage });

    // Save the user to the database
    await user.save();
    console.log('User saved successfully:', user); // Debug: Log the saved user
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error); // Debug: Log any errors
    res.status(500).json({ message: 'Server error during registration' });
  }
}

// Login an existing user
export async function login(req, res) {
  const { username, password } = req.body;

  // Debug: Log incoming login request
  console.log('Login request received:', { username, password });

  // Basic validation
  if (!username || !password) {
    console.log('Missing username or password:', { username, password }); // Debug: Missing credentials
    return res.status(400).json({ message: 'Please provide both username and password' });
  }

  try {
    // Find the user
    const user = await User.findOne({ username });
    console.log('User found:', user); // Debug: Log user found in DB
    if (!user) {
      console.log('User not found:', username); // Debug: User not found
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the password with the hashed password in the DB
    const isMatch = await compare(password, user.password);
    console.log('Password match status:', isMatch); // Debug: Log password comparison result
    if (!isMatch) {
      console.log('Password mismatch for user:', username); // Debug: Password mismatch
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate the JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('JWT token generated:', token); // Debug: Log generated token

    // Send response with the token and user details
    res.json({
      token,
      languages: user.languages,
      stage: user.stage
    });
  } catch (error) {
    console.error('Error during login:', error); // Debug: Log any errors during login
    res.status(500).json({ message: 'Server error during login' });
  }
}
