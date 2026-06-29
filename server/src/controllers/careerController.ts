import { Request, Response } from "express";
import * as careerService from "../services/careerService";

export const getStatus = (_req: Request, res: Response): void => {
  res.json(careerService.getCareerStatus());
};

export const getInterviewQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const role = (req.query.role as string) || "Software Engineer";
    const questions = await careerService.getInterviewQuestions(role);
    res.json({ questions });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch interview questions" });
  }
};

export const getSkillRoadmap = async (req: Request, res: Response): Promise<void> => {
  try {
    const track = (req.query.track as string) || "fullstack";
    const roadmap = await careerService.getSkillRoadmap(track);
    res.json(roadmap);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch skill roadmap" });
  }
};
