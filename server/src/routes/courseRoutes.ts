import { Router } from 'express';
import { getCourseDetails, getCourseProgress, markVideoCompleted, toggleSaveCourse, getSavedCourses, getLearningStats, recordLearningTime, getActiveCourses } from '../controllers/courseController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Active / Ongoing courses route
router.get('/active', authMiddleware, getActiveCourses);

// Progress routes (protected)
router.get('/progress/:playlistId', authMiddleware, getCourseProgress);
router.post('/progress/:playlistId', authMiddleware, markVideoCompleted);

// Save routes (protected)
router.post('/save', authMiddleware, toggleSaveCourse);
router.get('/saved', authMiddleware, getSavedCourses);

// Learning stats routes (protected)
router.get('/learning-stats', authMiddleware, getLearningStats);
router.post('/learning-stats/record-time', authMiddleware, recordLearningTime);

// Get playlist details and videos. Keep this after specific routes so it does not catch /saved or /progress/:playlistId.
router.get('/:playlistId', getCourseDetails);

export default router;
