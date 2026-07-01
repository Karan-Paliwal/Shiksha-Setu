import { Router } from "express";
import * as profileController from "../controllers/profileController";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../config/cloudinary";

const router = Router();

router.put("/setup", authMiddleware, upload.any(), profileController.setupProfile);
router.get("/me", authMiddleware, profileController.getProfile);
router.put("/skills", authMiddleware, profileController.updateSkills);

export default router;
