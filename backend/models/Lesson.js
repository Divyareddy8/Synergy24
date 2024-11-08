import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], // Multiple choice options
  correctAnswer: { type: String, required: true } // Correct answer
}, { _id: false }); // Prevents automatic _id for each question document

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },  // Ensure unique lesson titles
  description: { type: String, required: true },
  language: { type: String, required: true },
  stage: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true }, // Expanded stages
  content: { type: String, required: true },
  questions: [questionSchema],  // Add questions to each lesson
}, { timestamps: true }); // Automatically add createdAt and updatedAt

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
