import { Router } from 'express';
import { getCourseDetails, getCourseProgress, markVideoCompleted, toggleSaveCourse, getSavedCourses } from '../controllers/courseController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Progress routes (protected)
router.get('/progress/:playlistId', authMiddleware, getCourseProgress);
router.post('/progress/:playlistId', authMiddleware, markVideoCompleted);

// Save routes (protected)
router.post('/save', authMiddleware, toggleSaveCourse);
router.get('/saved', authMiddleware, getSavedCourses);

// Get playlist details and videos. Keep this after specific routes so it does not catch /saved or /progress/:playlistId.
router.get('/:playlistId', getCourseDetails);

export default router;
