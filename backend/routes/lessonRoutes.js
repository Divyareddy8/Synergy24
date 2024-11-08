import { Router } from 'express';
import { getLessons, getLessonById, createLesson } from '../controllers/lessonController.js';

const router = Router();

// Get lessons by language and stage
router.get('/', async (req, res) => {
  try {
    const { language, stage } = req.query;

    if (!language || !stage) {
      return res.status(400).json({ message: 'Language and stage are required' });
    }

    // Call the controller's getLessons method, which sends a response
    await getLessons(req, res);  // Let the controller handle sending the response
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get a specific lesson by ID
router.get('/:id', getLessonById);

// Create a new lesson
router.post('/', createLesson);

export default router;
