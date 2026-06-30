import { Router } from "express";
import * as aiController from "../controllers/aiController";
import { authMiddleware } from "../middleware/auth";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/status", aiController.getStatus);
router.post("/chat", authMiddleware, upload.single("file"), aiController.chat);

// Permanent Chat Sessions Endpoints
router.get("/sessions", authMiddleware, aiController.getSessions);
router.post("/sessions/save", authMiddleware, aiController.saveSession);
router.delete("/sessions/:id", authMiddleware, aiController.deleteSession);

export default router;
