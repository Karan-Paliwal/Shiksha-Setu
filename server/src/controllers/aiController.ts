import { Request, Response } from "express";
import * as aiService from "../services/aiService";

export const getStatus = (_req: Request, res: Response): void => {
  res.json(aiService.getAIStatus());
};

export const chat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, mode } = req.body;
    const file = req.file;

    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    const result = await aiService.getAIResponse(prompt, mode, file);
    res.json(result);
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
};
