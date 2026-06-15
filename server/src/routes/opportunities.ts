import { Router } from "express";
import * as opportunitiesController from "../controllers/opportunitiesController";

const router = Router();

router.get("/status", opportunitiesController.getStatus);
router.get("/scholarships", opportunitiesController.getScholarships);
router.get("/schemes", opportunitiesController.getGovernmentSchemes);

export default router;
