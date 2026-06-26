import { Router } from "express";
import * as profileController from "../controllers/profileController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.put("/setup", authMiddleware, profileController.setupProfile);
router.get("/me", authMiddleware, profileController.getProfile);

export default router;
