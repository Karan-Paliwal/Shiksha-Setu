import { Router } from "express";
import * as academicsController from "../controllers/academicsController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/status", academicsController.getStatus);
router.post("/attendance/predict", authMiddleware, academicsController.predictAttendance);
router.post("/cgpa/calculate", authMiddleware, academicsController.calculateCGPA);
router.post("/upload-marksheet", authMiddleware, academicsController.uploadMarksheet);

export default router;
