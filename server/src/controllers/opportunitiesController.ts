import { Request, Response } from "express";
import * as opportunitiesService from "../services/opportunitiesService";

export const getStatus = (_req: Request, res: Response): void => {
  res.json(opportunitiesService.getOpportunitiesStatus());
};

export const getScholarships = (_req: Request, res: Response): void => {
  res.json({ scholarships: opportunitiesService.getScholarships() });
};

export const getGovernmentSchemes = (_req: Request, res: Response): void => {
  res.json({ schemes: opportunitiesService.getGovernmentSchemes() });
};
