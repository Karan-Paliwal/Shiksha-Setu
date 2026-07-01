import { Router } from 'express';
import { getUserCertifications, verifyCredlyBadge, claimInternalCertificate } from '../controllers/certificationController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Secure all routes with authentication middleware
router.use(authMiddleware);

// Get user certifications
router.get('/', getUserCertifications);

// Verify and add external Credly badge
router.post('/verify-credly', verifyCredlyBadge);

// Claim internal course completion certificate
router.post('/claim-internal/:playlistId', claimInternalCertificate);

export default router;
