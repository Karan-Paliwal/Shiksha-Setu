import { Router } from "express";
import * as interviewController from "../controllers/interviewController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/dashboard", authMiddleware, interviewController.getDashboard);
router.get("/questions", authMiddleware, interviewController.getQuestionBank);
router.post("/attempts", authMiddleware, interviewController.recordAttempt);
router.post("/mocks", authMiddleware, interviewController.scheduleMock);
router.patch("/mocks/:id", authMiddleware, interviewController.updateMockStatus);
router.post("/posts", authMiddleware, interviewController.createPost);
router.post("/posts/:id/helpful", authMiddleware, interviewController.markPostHelpful);

export default router;
