import { Request, Response, NextFunction } from "express";
import * as opportunitiesService from "../services/opportunitiesService";

export const getStatus = (_req: Request, res: Response): void => {
  res.json(opportunitiesService.getOpportunitiesStatus());
};

export const getScholarships = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, state, category, degree, stream } = req.query;
    const scholarships = await opportunitiesService.getScholarships({
      search: typeof search === "string" ? search : undefined,
      state: typeof state === "string" ? state : undefined,
      category: typeof category === "string" ? category : undefined,
      degree: typeof degree === "string" ? degree : undefined,
      stream: typeof stream === "string" ? stream : undefined,
    });

    res.json({ scholarships });
  } catch (error) {
    next(error);
  }
};

export const getScholarshipById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const scholarship = await opportunitiesService.getScholarshipById(req.params.id);

    if (!scholarship) {
      res.status(404).json({ error: "Scholarship not found" });
      return;
    }

    res.json({ scholarship });
  } catch (error) {
    next(error);
  }
};

export const getGovernmentSchemes = (_req: Request, res: Response): void => {
  res.json({ schemes: opportunitiesService.getGovernmentSchemes() });
};
