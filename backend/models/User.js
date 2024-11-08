import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },  // Ensuring username is unique
  password: { type: String, required: true },  // Password field
  email: { type: String, required: true, unique: true },  // Optional: for email-based login or notifications
  languages: [{ type: String }], // Languages known by the user
  stage: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' }, // Added 'Advanced' for more flexibility
  points: { type: Number, default: 0 },  // Points for tracking user progress
  rewards: [{ 
    type: new Schema({
      rewardName: { type: String, required: true },
      dateEarned: { type: Date, default: Date.now }
    })
  }]
}, { timestamps: true });  // Automatically adds 'createdAt' and 'updatedAt' timestamps

// Export the User model to be used in controllers
const User = model('User', userSchema);

export default User;
