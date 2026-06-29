import { Router } from "express";
import * as opportunitiesController from "../controllers/opportunitiesController";

const router = Router();

router.get("/", opportunitiesController.getScholarships);
router.get("/status", opportunitiesController.getStatus);
router.get("/scholarships", opportunitiesController.getScholarships);
router.get("/schemes", opportunitiesController.getGovernmentSchemes);
router.get("/:id", opportunitiesController.getScholarshipById);

export default router;
