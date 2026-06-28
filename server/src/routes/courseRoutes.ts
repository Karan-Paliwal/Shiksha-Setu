import { Router } from 'express';
import { getCourseDetails, getCourseProgress, markVideoCompleted, toggleSaveCourse, getSavedCourses } from '../controllers/courseController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get playlist details and videos
router.get('/:playlistId', getCourseDetails);

// Progress routes (protected)
router.get('/progress/:playlistId', authMiddleware, getCourseProgress);
router.post('/progress/:playlistId', authMiddleware, markVideoCompleted);

// Save routes (protected)
router.post('/save', authMiddleware, toggleSaveCourse);
router.get('/saved', authMiddleware, getSavedCourses);

export default router;
