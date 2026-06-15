import { Router } from "express";
import * as authController from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Protected routes
router.get("/profile", authMiddleware, authController.getProfile);

export default router;
