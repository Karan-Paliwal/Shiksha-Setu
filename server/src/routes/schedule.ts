import { Router } from "express";
import * as scheduleController from "../controllers/scheduleController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/save", authMiddleware, scheduleController.saveSchedule);
router.get("/my-schedule", authMiddleware, scheduleController.getSchedule);

export default router;
