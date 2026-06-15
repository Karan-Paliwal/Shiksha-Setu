import { Router } from "express";
import * as careerController from "../controllers/careerController";

const router = Router();

router.get("/status", careerController.getStatus);
router.get("/interview-questions", careerController.getInterviewQuestions);
router.get("/roadmap", careerController.getSkillRoadmap);

export default router;
