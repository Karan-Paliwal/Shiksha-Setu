import { Request, Response } from "express";
import * as careerService from "../services/careerService";

export const getStatus = (_req: Request, res: Response): void => {
  res.json(careerService.getCareerStatus());
};

export const getInterviewQuestions = (_req: Request, res: Response): void => {
  res.json({ questions: careerService.getInterviewQuestions() });
};

export const getSkillRoadmap = (req: Request, res: Response): void => {
  const track = (req.query.track as string) || "fullstack";
  res.json(careerService.getSkillRoadmap(track));
};
