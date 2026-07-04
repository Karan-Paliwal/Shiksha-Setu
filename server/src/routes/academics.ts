import { Router } from "express";
import * as academicsController from "../controllers/academicsController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/status", academicsController.getStatus);
router.get("/dashboard", authMiddleware, academicsController.getDashboard);
router.post("/cgpa/calculate", authMiddleware, academicsController.calculateCGPA);
router.post("/tasks", authMiddleware, academicsController.createTask);
router.patch("/tasks/:id", authMiddleware, academicsController.updateTask);
router.delete("/tasks/:id", authMiddleware, academicsController.deleteTask);
router.post("/study-plans", authMiddleware, academicsController.createStudyPlan);
router.post("/upload-marksheet", authMiddleware, academicsController.uploadMarksheet);

export default router;
