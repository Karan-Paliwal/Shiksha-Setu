import { Request, Response } from "express";
import * as aiService from "../services/aiService";
import AIChatHistory from "../models/AIChatHistory";
import { AuthRequest } from "../middleware/auth";

export const getStatus = (_req: Request, res: Response): void => {
  res.json(aiService.getAIStatus());
};

export const chat = async (req: AuthRequest, res: Response): Promise<void> => {
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

export const getSessions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const sessions = await AIChatHistory.find({ userId }).sort({ updatedAt: -1 });
    res.json({ sessions });
  } catch (error: any) {
    console.error("Get Sessions Error:", error);
    res.status(500).json({ error: "Failed to retrieve chat sessions" });
  }
};

export const saveSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { sessionId, name, messages, insights, mode } = req.body;

    if (!sessionId || !name || !messages) {
      res.status(400).json({ error: "sessionId, name, and messages are required" });
      return;
    }

    let session = await AIChatHistory.findOne({ userId, sessionId });

    if (session) {
      session.name = name;
      session.messages = messages;
      session.insights = insights || { takeaways: [], recommendations: [] };
      session.mode = mode || "default";
      session.updatedAt = new Date();
      await session.save();
    } else {
      session = new AIChatHistory({
        userId,
        sessionId,
        name,
        messages,
        insights: insights || { takeaways: [], recommendations: [] },
        mode: mode || "default",
      });
      await session.save();
    }

    res.json({ success: true, session });
  } catch (error: any) {
    console.error("Save Session Error:", error);
    res.status(500).json({ error: "Failed to save chat session" });
  }
};

export const deleteSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { id } = req.params; // this is the sessionId

    const result = await AIChatHistory.deleteOne({ userId, sessionId: id });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    res.json({ success: true, message: "Session deleted successfully" });
  } catch (error: any) {
    console.error("Delete Session Error:", error);
    res.status(500).json({ error: "Failed to delete chat session" });
  }
};

export const startMock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { history, mode, resumeText } = req.body;
    const result = await aiService.generateMockQuestion(history || [], mode || "behavioral", resumeText);
    res.json(result);
  } catch (error: any) {
    console.error("Start Mock Error:", error);
    res.status(500).json({ error: error.message || "Failed to start mock interview" });
  }
};

export const chatMock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { history, answer, code, mode } = req.body;
    if (!answer && !code) {
      res.status(400).json({ error: "Answer or code is required" });
      return;
    }
    const result = await aiService.evaluateMockAnswer(history || [], answer, code, mode || "behavioral");
    res.json(result);
  } catch (error: any) {
    console.error("Chat Mock Error:", error);
    res.status(500).json({ error: error.message || "Failed to evaluate answer" });
  }
};

export const finishMock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { history } = req.body;
    if (!history || history.length === 0) {
      res.status(400).json({ error: "History is required to generate scorecard" });
      return;
    }
    const result = await aiService.generateMockScorecard(history);
    res.json(result);
  } catch (error: any) {
    console.error("Finish Mock Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate scorecard" });
  }
};
