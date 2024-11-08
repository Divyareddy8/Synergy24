import { Router } from 'express';
import { updateUserProgress } from '../controllers/userController.js';
const router = Router();

// Update user progress (no register/login here, already handled in authRoutes)
router.post('/progress', updateUserProgress);

export default router;
