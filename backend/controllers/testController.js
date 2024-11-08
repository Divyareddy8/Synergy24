import Lesson from '../models/Lesson.js'; // Assuming you're using a Mongoose model for Lesson

export async function submitTest(req, res) {
  const { lessonId, userAnswers } = req.body; // lessonId should be used to fetch the lesson
  
  try {
    if (!lessonId || !Array.isArray(userAnswers)) {
      return res.status(400).json({ message: 'Invalid input, lessonId and userAnswers are required' });
    }
    
    // Fetch the lesson from the database
    const lesson = await Lesson.findById(lessonId); // Use lessonId to get the lesson from DB
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    let score = 0;
    // Validate that userAnswers length matches the number of questions
    if (userAnswers.length !== lesson.questions.length) {
      return res.status(400).json({ message: 'Number of answers does not match number of questions' });
    }

    // Calculate the score by comparing user answers to correct answers
    lesson.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) score++;
    });

    res.json({ score, totalQuestions: lesson.questions.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
