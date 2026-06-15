import { Request, Response } from "express";
import * as aiService from "../services/aiService";

export const getStatus = (_req: Request, res: Response): void => {
  res.json(aiService.getAIStatus());
};

// TODO: Integrate real AI API
export const chat = (req: Request, res: Response): void => {
  const { prompt, mode } = req.body;
  if (!prompt) {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }
  const result = aiService.getAIResponse(prompt, mode);
  res.json(result);
};
