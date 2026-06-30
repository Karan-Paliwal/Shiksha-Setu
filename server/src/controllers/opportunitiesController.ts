import { NextFunction, Request, Response } from "express";
import * as opportunitiesService from "../services/opportunitiesService";

export const getStatus = (_req: Request, res: Response): void => {
  res.json(opportunitiesService.getOpportunitiesStatus());
};

export const getScholarships = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const scholarships = await opportunitiesService.getScholarships({
      search: req.query.search as string | undefined,
      state: req.query.state as string | undefined,
      category: req.query.category as string | undefined,
      degree: req.query.degree as string | undefined,
      stream: req.query.stream as string | undefined,
    });

    res.json({ scholarships });
  } catch (error) {
    next(error);
  }
};

export const getScholarshipById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
